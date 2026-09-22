import { describe, it, expect } from 'vitest';
import { validatePuzzleAnswer, canRequestHint, getHintCooldownEnd } from '@/utils/puzzle-engine';
import type { Puzzle } from '@/types/adventure';

const keywordPuzzle: Puzzle = {
  id: 'test-kw',
  type: 'keyword',
  prompt: 'test',
  config: { type: 'keyword', answers: ['mist', 'fog'], caseSensitive: false },
};

describe('puzzle-engine', () => {
  it('validates keyword answers case-insensitively', () => {
    expect(validatePuzzleAnswer(keywordPuzzle, 'MIST').correct).toBe(true);
    expect(validatePuzzleAnswer(keywordPuzzle, 'rain').correct).toBe(false);
  });

  it('validates multiple choice', () => {
    const puzzle: Puzzle = {
      id: 'mc',
      type: 'multiple_choice',
      prompt: 'pick',
      config: { type: 'multiple_choice', options: ['a', 'b'], correctIndex: 1 },
    };
    expect(validatePuzzleAnswer(puzzle, 1).correct).toBe(true);
    expect(validatePuzzleAnswer(puzzle, 0).correct).toBe(false);
  });

  it('validates sequence order', () => {
    const puzzle: Puzzle = {
      id: 'seq',
      type: 'sequence',
      prompt: 'order',
      config: { type: 'sequence', items: ['a', 'b', 'c'], correctOrder: [0, 1, 2] },
    };
    expect(validatePuzzleAnswer(puzzle, [0, 1, 2]).correct).toBe(true);
    expect(validatePuzzleAnswer(puzzle, [2, 1, 0]).correct).toBe(false);
  });

  it('manages hint cooldowns', () => {
    expect(canRequestHint('stage-1', 1, {})).toBe(true);
    const end = getHintCooldownEnd(5);
    expect(canRequestHint('stage-1', 1, { 'stage-1-1': end })).toBe(false);
  });
});
