import { describe, it, expect } from 'vitest';
import { getStageStatus, getNextStage, isChapterComplete } from '@/utils/adventure-unlock';
import { adventureStages } from '@/services/mock-data/adventure-stages';
import type { AdventureProgress } from '@/types/adventure';

const baseProgress = (overrides: Partial<AdventureProgress> = {}): AdventureProgress => ({
  id: 'prog-1',
  userId: 'user-1',
  code: 'NEG-TRAIL01',
  completedStageIds: [],
  currentStageId: adventureStages[0].id,
  artifactIds: [],
  hintLevels: {},
  hintCooldowns: {},
  attempts: [],
  paused: false,
  startedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('adventure-unlock', () => {
  it('unlocks first stage without progress', () => {
    const first = adventureStages[0];
    expect(getStageStatus(first, null)).toBe('available');
    expect(getStageStatus(adventureStages[1], null)).toBe('locked');
  });

  it('locks stages until previous is complete', () => {
    const progress = baseProgress({ completedStageIds: [adventureStages[0].id] });
    expect(getStageStatus(adventureStages[1], progress)).toBe('available');
    expect(getStageStatus(adventureStages[2], progress)).toBe('locked');
  });

  it('returns next available stage', () => {
    const progress = baseProgress({ completedStageIds: [adventureStages[0].id] });
    const next = getNextStage(adventureStages, progress);
    expect(next?.id).toBe(adventureStages[1].id);
  });

  it('detects chapter completion', () => {
    const chapterId = adventureStages[0].chapterId;
    const chapterStages = adventureStages.filter((s) => s.chapterId === chapterId);
    const progress = baseProgress({ completedStageIds: chapterStages.map((s) => s.id) });
    expect(isChapterComplete(chapterId, adventureStages, progress)).toBe(true);
  });
});
