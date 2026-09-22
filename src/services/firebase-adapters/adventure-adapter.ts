import type { AdventureProgress, PuzzleAttempt, AdventureCode } from '@/types/adventure';
import { adventureStages } from '../mock-data/adventure-stages';
import { adventureChapters } from '../mock-data/adventure-chapters';
import {
  mockLeaderboard,
  evaluateAchievements,
  mockAdventureCodes,
} from '../mock-data/adventure-meta';
import { validatePuzzleAnswer, canRequestHint, getHintCooldownEnd } from '@/utils/puzzle-engine';
import {
  getStageStatus,
  getNextStage,
  isChapterComplete,
  passesSafetyGate,
  isDaylightHour,
} from '@/utils/adventure-unlock';
import type { AdventureRepository } from '../repositories/adventure-repository';
import { COLLECTIONS } from '../firebase/collections';
import {
  fetchCollection,
  fetchDocument,
  upsertDocument,
  deleteDocument,
} from '../firebase/firestore-helpers';

async function loadCodes(): Promise<AdventureCode[]> {
  const codes = await fetchCollection<AdventureCode>(COLLECTIONS.ADVENTURE_CODES);
  return codes.length ? codes : mockAdventureCodes;
}

async function loadProgress(userId: string): Promise<AdventureProgress | null> {
  return fetchDocument<AdventureProgress>(COLLECTIONS.ADVENTURE_PROGRESS, userId);
}

async function saveProgress(progress: AdventureProgress) {
  await upsertDocument(COLLECTIONS.ADVENTURE_PROGRESS, progress.userId, progress);
}

async function loadAllProgress(): Promise<AdventureProgress[]> {
  return fetchCollection<AdventureProgress>(COLLECTIONS.ADVENTURE_PROGRESS);
}

export function createFirebaseAdventureRepository(): AdventureRepository {
  return {
    async getChapters() {
      return { data: adventureChapters };
    },

    async getStages() {
      return { data: adventureStages };
    },

    async getStageById(id) {
      return { data: adventureStages.find((s) => s.id === id) ?? null };
    },

    async validateCode(code) {
      const normalized = code.trim().toUpperCase();
      const codes = await loadCodes();
      const found = codes.find((c) => c.code.toUpperCase() === normalized && c.active);
      return { data: { valid: !!found, code: normalized } };
    },

    async startAdventure(userId, code) {
      const validation = await this.validateCode(code);
      if (!validation.data.valid) {
        return { data: null as never, error: 'Invalid or inactive adventure code.' };
      }

      const existing = await loadProgress(userId);
      if (existing) {
        const updated: AdventureProgress = {
          ...existing,
          code: validation.data.code,
          updatedAt: new Date().toISOString(),
        };
        await saveProgress(updated);
        return { data: updated };
      }

      const now = new Date().toISOString();
      const progress: AdventureProgress = {
        id: userId,
        userId,
        code: validation.data.code,
        completedStageIds: [],
        currentStageId: adventureStages[0].id,
        artifactIds: [],
        hintLevels: {},
        hintCooldowns: {},
        attempts: [],
        paused: false,
        startedAt: now,
        updatedAt: now,
      };
      await saveProgress(progress);
      return { data: progress };
    },

    async getProgress(userId) {
      return { data: await loadProgress(userId) };
    },

    async submitAnswer(userId, stageId, answer) {
      const progress = await loadProgress(userId);
      if (!progress)
        return { data: null as never, error: 'No active adventure. Enter your code first.' };
      if (progress.paused)
        return { data: null as never, error: 'Adventure is paused. Resume to continue.' };

      const stage = adventureStages.find((s) => s.id === stageId);
      if (!stage) return { data: null as never, error: 'Stage not found' };

      const status = getStageStatus(stage, progress);
      if (status === 'locked')
        return { data: null as never, error: 'This stage is not yet unlocked.' };
      if (status === 'completed')
        return { data: { correct: true, message: 'Already completed', completed: true } };

      if (!passesSafetyGate(stage, isDaylightHour())) {
        return {
          data: {
            correct: false,
            message:
              'This outdoor stage is daylight-only. Return during safe hours or request staff assistance.',
          },
        };
      }

      const result = validatePuzzleAnswer(stage.puzzle, answer);
      const attempt: PuzzleAttempt = {
        stageId,
        answer: String(answer),
        correct: result.correct,
        timestamp: new Date().toISOString(),
      };
      progress.attempts.push(attempt);

      if (result.correct) {
        if (!progress.completedStageIds.includes(stageId)) {
          progress.completedStageIds.push(stageId);
          progress.artifactIds.push(stage.artifact.id);
        }
        const next = getNextStage(adventureStages, progress);
        progress.currentStageId = next?.id ?? null;
        progress.updatedAt = new Date().toISOString();
        await saveProgress(progress);
        return { data: { correct: true, completed: true } };
      }

      progress.updatedAt = new Date().toISOString();
      await saveProgress(progress);
      return { data: { correct: false, message: result.message } };
    },

    async requestHint(userId, stageId, level) {
      const progress = await loadProgress(userId);
      if (!progress) return { data: null as never, error: 'No active adventure' };

      const stage = adventureStages.find((s) => s.id === stageId);
      if (!stage) return { data: null as never, error: 'Stage not found' };

      const hint = stage.hints.find((h) => h.level === level);
      if (!hint) return { data: null as never, error: 'Hint not available' };

      if (!canRequestHint(stageId, level, progress.hintCooldowns)) {
        return {
          data: null as never,
          error: 'Hint cooldown active. Wait before requesting another hint.',
        };
      }

      const key = `${stageId}-${level}`;
      progress.hintLevels[stageId] = Math.max(progress.hintLevels[stageId] ?? 0, level);
      progress.hintCooldowns[key] = getHintCooldownEnd(hint.cooldownMinutes);
      progress.updatedAt = new Date().toISOString();
      await saveProgress(progress);

      return { data: { text: hint.text } };
    },

    async pauseAdventure(userId) {
      const progress = await loadProgress(userId);
      if (!progress) return { data: null as never, error: 'No active adventure' };
      progress.paused = true;
      progress.updatedAt = new Date().toISOString();
      await saveProgress(progress);
      return { data: progress };
    },

    async resumeAdventure(userId) {
      const progress = await loadProgress(userId);
      if (!progress) return { data: null as never, error: 'No active adventure' };
      progress.paused = false;
      progress.updatedAt = new Date().toISOString();
      await saveProgress(progress);
      return { data: progress };
    },

    async getAchievements(userId) {
      const progress = await loadProgress(userId);
      if (!progress) return { data: [] };

      let chaptersComplete = 0;
      for (const ch of adventureChapters) {
        if (isChapterComplete(ch.id, adventureStages, progress)) chaptersComplete++;
      }

      return {
        data: evaluateAchievements(
          progress.completedStageIds.length,
          progress.artifactIds.length,
          chaptersComplete,
        ),
      };
    },

    async getLeaderboard() {
      return { data: mockLeaderboard };
    },
  };
}

export async function listAllAdventureProgress(): Promise<AdventureProgress[]> {
  return loadAllProgress();
}

export async function listAdventureCodes(): Promise<AdventureCode[]> {
  return loadCodes();
}

export async function saveAdventureCode(code: AdventureCode) {
  await upsertDocument(COLLECTIONS.ADVENTURE_CODES, code.id, code);
}

export async function deleteAdventureProgress(userId: string) {
  await deleteDocument(COLLECTIONS.ADVENTURE_PROGRESS, userId);
}
