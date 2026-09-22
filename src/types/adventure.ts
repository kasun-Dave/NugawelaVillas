export type PuzzleType =
  | 'keyword'
  | 'observation'
  | 'sequence'
  | 'riddle'
  | 'map_pin'
  | 'matching'
  | 'cipher'
  | 'symbol'
  | 'multiple_choice'
  | 'staff_checkpoint';

export type LocationType = 'resort' | 'partner' | 'approved_outdoor';

export interface AdventureChapter {
  id: string;
  order: number;
  title: string;
  description: string;
  summary: string;
}

export interface Hint {
  level: number;
  text: string;
  cooldownMinutes: number;
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  flavorText: string;
}

export interface Puzzle {
  id: string;
  type: PuzzleType;
  prompt: string;
  config: PuzzleConfig;
}

export type PuzzleConfig =
  | KeywordConfig
  | ObservationConfig
  | SequenceConfig
  | RiddleConfig
  | MapPinConfig
  | MatchingConfig
  | CipherConfig
  | SymbolConfig
  | MultipleChoiceConfig
  | StaffCheckpointConfig;

export interface KeywordConfig {
  type: 'keyword';
  answers: string[];
  caseSensitive?: boolean;
}

export interface ObservationConfig {
  type: 'observation';
  question: string;
  answers: string[];
}

export interface SequenceConfig {
  type: 'sequence';
  items: string[];
  correctOrder: number[];
}

export interface RiddleConfig {
  type: 'riddle';
  answers: string[];
}

export interface MapPinConfig {
  type: 'map_pin';
  options: { id: string; label: string }[];
  correctId: string;
}

export interface MatchingConfig {
  type: 'matching';
  pairs: { left: string; right: string }[];
}

export interface CipherConfig {
  type: 'cipher';
  encoded: string;
  answers: string[];
  hint: string;
}

export interface SymbolConfig {
  type: 'symbol';
  symbols: string[];
  correctSymbol: string;
}

export interface MultipleChoiceConfig {
  type: 'multiple_choice';
  options: string[];
  correctIndex: number;
  isFictionalNote?: boolean;
}

export interface StaffCheckpointConfig {
  type: 'staff_checkpoint';
  checkpointCode: string;
  staffPhrase: string;
}

export interface AdventureStage {
  id: string;
  chapterId: string;
  order: number;
  title: string;
  narrative: string;
  clueType: string;
  locationType: LocationType;
  locationName: string;
  unlockRequirement: { previousStageId?: string };
  hints: Hint[];
  puzzle: Puzzle;
  artifact: Artifact;
  storyFragment: string;
  safetyNote: string;
  estimatedDurationMinutes: number;
  accessibilityNotes: string;
  isFictionalStory: boolean;
  daylightOnly: boolean;
  mapZone: { x: number; y: number };
}

export interface AdventureCode {
  id: string;
  code: string;
  label: string;
  active: boolean;
  createdAt: string;
}

export interface PuzzleAttempt {
  stageId: string;
  answer: string;
  correct: boolean;
  timestamp: string;
}

export interface AdventureProgress {
  id: string;
  userId: string;
  code: string;
  completedStageIds: string[];
  currentStageId: string | null;
  artifactIds: string[];
  hintLevels: Record<string, number>;
  hintCooldowns: Record<string, string>;
  attempts: PuzzleAttempt[];
  paused: boolean;
  startedAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

export interface LeaderboardEntry {
  guestName: string;
  completedStages: number;
  artifactsCollected: number;
  rank: number;
}
