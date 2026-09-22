import type { AdventureProgress, AdventureStage, PuzzleAttempt } from '@/types/adventure';
import type { RepositoryResult } from '@/types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage';
import { adventureStages } from '../mock-data/adventure-stages';
import { adventureChapters } from '../mock-data/adventure-chapters';
import {
  mockAchievements,
  mockLeaderboard,
  evaluateAchievements,
} from '../mock-data/adventure-meta';
import { getPersistedAdventureCodes } from '../mock-data/adventure-codes-store';
import { validatePuzzleAnswer, canRequestHint, getHintCooldownEnd } from '@/utils/puzzle-engine';
import {
  getStageStatus,
  getNextStage,
  isChapterComplete,
  passesSafetyGate,
  isDaylightHour,
} from '@/utils/adventure-unlock';

function getAllProgress(): AdventureProgress[] {
  return getStorageItem<AdventureProgress[]>(STORAGE_KEYS.ADVENTURE_PROGRESS, []);
}

function saveProgress(all: AdventureProgress[]) {
  setStorageItem(STORAGE_KEYS.ADVENTURE_PROGRESS, all);
}

export interface AdventureRepository {
  getChapters(): Promise<RepositoryResult<typeof adventureChapters>>;
  getStages(): Promise<RepositoryResult<AdventureStage[]>>;
  getStageById(id: string): Promise<RepositoryResult<AdventureStage | null>>;
  validateCode(code: string): Promise<RepositoryResult<{ valid: boolean; code: string }>>;
  startAdventure(userId: string, code: string): Promise<RepositoryResult<AdventureProgress>>;
  getProgress(userId: string): Promise<RepositoryResult<AdventureProgress | null>>;
  submitAnswer(
    userId: string,
    stageId: string,
    answer: string | number[],
  ): Promise<RepositoryResult<{ correct: boolean; message?: string; completed?: boolean }>>;
  requestHint(
    userId: string,
    stageId: string,
    level: number,
  ): Promise<RepositoryResult<{ text: string }>>;
  pauseAdventure(userId: string): Promise<RepositoryResult<AdventureProgress>>;
  resumeAdventure(userId: string): Promise<RepositoryResult<AdventureProgress>>;
  getAchievements(userId: string): Promise<RepositoryResult<typeof mockAchievements>>;
  getLeaderboard(): Promise<RepositoryResult<typeof mockLeaderboard>>;
}

class LocalAdventureRepository implements AdventureRepository {
  async getChapters() {
    return { data: adventureChapters };
  }

  async getStages() {
    return { data: adventureStages };
  }

  async getStageById(id: string) {
    return { data: adventureStages.find((s) => s.id === id) ?? null };
  }

  async validateCode(code: string) {
    const normalized = code.trim().toUpperCase();
    const codes = getPersistedAdventureCodes();
    const found = codes.find((c) => c.code.toUpperCase() === normalized && c.active);
    return { data: { valid: !!found, code: normalized } };
  }

  async startAdventure(userId: string, code: string) {
    const validation = await this.validateCode(code);
    if (!validation.data.valid) {
      return { data: null as never, error: 'Invalid or inactive adventure code.' };
    }

    const all = getAllProgress();
    const existing = all.find((p) => p.userId === userId);
    if (existing) {
      existing.code = validation.data.code;
      existing.updatedAt = new Date().toISOString();
      saveProgress(all);
      return { data: existing };
    }

    const now = new Date().toISOString();
    const progress: AdventureProgress = {
      id: crypto.randomUUID(),
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
    all.push(progress);
    saveProgress(all);
    return { data: progress };
  }

  async getProgress(userId: string) {
    const all = getAllProgress();
    return { data: all.find((p) => p.userId === userId) ?? null };
  }

  async submitAnswer(userId: string, stageId: string, answer: string | number[]) {
    const all = getAllProgress();
    const progress = all.find((p) => p.userId === userId);
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
      saveProgress(all);
      return { data: { correct: true, completed: true } };
    }

    progress.updatedAt = new Date().toISOString();
    saveProgress(all);
    return { data: { correct: false, message: result.message } };
  }

  async requestHint(userId: string, stageId: string, level: number) {
    const all = getAllProgress();
    const progress = all.find((p) => p.userId === userId);
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
    saveProgress(all);

    return { data: { text: hint.text } };
  }

  async pauseAdventure(userId: string) {
    const all = getAllProgress();
    const progress = all.find((p) => p.userId === userId);
    if (!progress) return { data: null as never, error: 'No active adventure' };
    progress.paused = true;
    progress.updatedAt = new Date().toISOString();
    saveProgress(all);
    return { data: progress };
  }

  async resumeAdventure(userId: string) {
    const all = getAllProgress();
    const progress = all.find((p) => p.userId === userId);
    if (!progress) return { data: null as never, error: 'No active adventure' };
    progress.paused = false;
    progress.updatedAt = new Date().toISOString();
    saveProgress(all);
    return { data: progress };
  }

  async getAchievements(userId: string) {
    const progress = getAllProgress().find((p) => p.userId === userId);
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
  }

  async getLeaderboard() {
    return { data: mockLeaderboard };
  }
}

export function createLocalAdventureRepository(): AdventureRepository {
  return new LocalAdventureRepository();
}

export const adventureRepository: AdventureRepository = createLocalAdventureRepository();
