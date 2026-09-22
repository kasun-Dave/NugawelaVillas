import { describe, it, expect, beforeEach } from 'vitest';
import { adventureRepository } from '@/services/repositories/adventure-repository';
import { removeStorageItem, STORAGE_KEYS } from '@/utils/storage';

const USER_ID = 'test-guest-adventure';

describe('AdventureRepository', () => {
  beforeEach(() => {
    removeStorageItem(STORAGE_KEYS.ADVENTURE_PROGRESS);
  });

  it('validates active adventure codes', async () => {
    const valid = await adventureRepository.validateCode('NEG-TRAIL01');
    expect(valid.data.valid).toBe(true);

    const invalid = await adventureRepository.validateCode('INVALID-CODE');
    expect(invalid.data.valid).toBe(false);
  });

  it('starts adventure and tracks progress', async () => {
    const start = await adventureRepository.startAdventure(USER_ID, 'NEG-TRAIL01');
    expect(start.data.code).toBe('NEG-TRAIL01');
    expect(start.data.completedStageIds).toHaveLength(0);

    const progress = await adventureRepository.getProgress(USER_ID);
    expect(progress.data?.userId).toBe(USER_ID);
  });

  it('submits correct answer and advances stage', async () => {
    await adventureRepository.startAdventure(USER_ID, 'NEG-TRAIL01');
    const result = await adventureRepository.submitAnswer(USER_ID, 'stage-01-mist-gate', 'mist');
    expect(result.data.correct).toBe(true);

    const progress = await adventureRepository.getProgress(USER_ID);
    expect(progress.data?.completedStageIds).toContain('stage-01-mist-gate');
    expect(progress.data?.artifactIds).toContain('artifact-mist-token');
  });

  it('rejects wrong answers', async () => {
    await adventureRepository.startAdventure(USER_ID, 'NEG-TRAIL01');
    const result = await adventureRepository.submitAnswer(USER_ID, 'stage-01-mist-gate', 'wrong');
    expect(result.data.correct).toBe(false);
  });

  it('pauses and resumes adventure', async () => {
    await adventureRepository.startAdventure(USER_ID, 'NEG-TRAIL01');
    const paused = await adventureRepository.pauseAdventure(USER_ID);
    expect(paused.data.paused).toBe(true);

    const resumed = await adventureRepository.resumeAdventure(USER_ID);
    expect(resumed.data.paused).toBe(false);
  });
});
