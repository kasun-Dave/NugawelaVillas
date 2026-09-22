import type { Puzzle } from '@/types/adventure';

export interface ValidationResult {
  correct: boolean;
  message?: string;
}

function normalize(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function validatePuzzleAnswer(
  puzzle: Puzzle,
  answer: string | number | number[],
): ValidationResult {
  const config = puzzle.config;

  switch (config.type) {
    case 'keyword':
      return validateKeyword(config, String(answer));
    case 'riddle':
      return validateKeyword(config.answers, String(answer));
    case 'observation':
      return validateKeyword(config.answers, String(answer));
    case 'multiple_choice':
      return validateMultipleChoice(config, Number(answer));
    case 'map_pin':
      return validateMapPin(config, String(answer));
    case 'cipher':
      return validateKeyword(config.answers, String(answer));
    case 'symbol':
      return validateSymbol(config, String(answer));
    case 'staff_checkpoint':
      return validateStaffCheckpoint(config, String(answer));
    case 'sequence':
      return validateSequence(config, answer as number[]);
    case 'matching':
      return { correct: true, message: 'Matching puzzles validated on completion' };
    default:
      return { correct: false, message: 'Unknown puzzle type' };
  }
}

function validateKeyword(
  answers: string[] | { answers: string[]; caseSensitive?: boolean },
  answer: string,
): ValidationResult {
  const list = Array.isArray(answers) ? answers : answers.answers;
  const caseSensitive = Array.isArray(answers) ? false : answers.caseSensitive;
  const normalized = caseSensitive ? answer.trim() : normalize(answer);
  const matches = list.some((a) =>
    caseSensitive ? a === normalized : normalize(a) === normalized,
  );
  return matches
    ? { correct: true }
    : { correct: false, message: "That doesn't match. Look again and try once more." };
}

function validateMultipleChoice(
  config: { correctIndex: number },
  answer: number,
): ValidationResult {
  return answer === config.correctIndex
    ? { correct: true }
    : { correct: false, message: 'Not quite — reconsider the cultural context.' };
}

function validateMapPin(config: { correctId: string }, answer: string): ValidationResult {
  return answer === config.correctId
    ? { correct: true }
    : { correct: false, message: 'That location is not approved for this stage.' };
}

function validateSymbol(config: { correctSymbol: string }, answer: string): ValidationResult {
  return answer === config.correctSymbol
    ? { correct: true }
    : { correct: false, message: "That symbol doesn't match the Navigator's Cross." };
}

function validateStaffCheckpoint(
  config: { checkpointCode: string; staffPhrase: string },
  answer: string,
): ValidationResult {
  const n = normalize(answer);
  if (n === normalize(config.checkpointCode) || n === normalize(config.staffPhrase)) {
    return { correct: true };
  }
  return {
    correct: false,
    message: 'Checkpoint code not recognized. Ask the story keeper for assistance.',
  };
}

function validateSequence(config: { correctOrder: number[] }, answer: number[]): ValidationResult {
  if (!Array.isArray(answer) || answer.length !== config.correctOrder.length) {
    return { correct: false, message: 'Select all items in order.' };
  }
  const correct = answer.every((v, i) => v === config.correctOrder[i]);
  return correct
    ? { correct: true }
    : {
        correct: false,
        message: "The sequence isn't right. Try the traditional spice blessing order.",
      };
}

export function canRequestHint(
  stageId: string,
  hintLevel: number,
  hintCooldowns: Record<string, string>,
): boolean {
  const key = `${stageId}-${hintLevel}`;
  const cooldownEnd = hintCooldowns[key];
  if (!cooldownEnd) return true;
  return new Date() >= new Date(cooldownEnd);
}

export function getHintCooldownEnd(cooldownMinutes: number): string {
  const end = new Date();
  end.setMinutes(end.getMinutes() + cooldownMinutes);
  return end.toISOString();
}
