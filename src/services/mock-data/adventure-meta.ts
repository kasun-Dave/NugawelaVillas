import type { AdventureCode, Achievement, LeaderboardEntry } from '@/types/adventure';

export const mockAdventureCodes: AdventureCode[] = [
  {
    id: 'code-1',
    code: 'NEG-TRAIL01',
    label: 'Demo Trail Code',
    active: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'code-2',
    code: 'NEG-TRAIL02',
    label: 'Demo Trail Code 2',
    active: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'code-3',
    code: 'WELCOME-VALLEY',
    label: 'Welcome Card Code',
    active: true,
    createdAt: '2026-01-01',
  },
];

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-first-step',
    name: 'First Step',
    description: 'Complete your first stage',
    icon: '🌿',
    condition: '1 stage',
  },
  {
    id: 'ach-arrival',
    name: 'The Arrival',
    description: 'Complete Chapter 1',
    icon: '🚪',
    condition: 'Chapter 1',
  },
  {
    id: 'ach-garden',
    name: 'Garden Whisperer',
    description: 'Complete Chapter 2',
    icon: '🌸',
    condition: 'Chapter 2',
  },
  {
    id: 'ach-keeper',
    name: 'Valley Keeper',
    description: 'Complete Chapter 3',
    icon: '🏔️',
    condition: 'Chapter 3',
  },
  {
    id: 'ach-lantern',
    name: 'Lantern Bearer',
    description: 'Complete the full trail',
    icon: '🏮',
    condition: 'All 12 stages',
  },
  {
    id: 'ach-collector',
    name: 'Artifact Collector',
    description: 'Collect 6 artifacts',
    icon: '💎',
    condition: '6 artifacts',
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { guestName: 'Elena M.', completedStages: 12, artifactsCollected: 12, rank: 1 },
  { guestName: 'James O.', completedStages: 10, artifactsCollected: 10, rank: 2 },
  { guestName: 'Priya S.', completedStages: 8, artifactsCollected: 8, rank: 3 },
  { guestName: 'Marco L.', completedStages: 6, artifactsCollected: 6, rank: 4 },
  { guestName: 'Sarah K.', completedStages: 4, artifactsCollected: 4, rank: 5 },
];

export function evaluateAchievements(
  completedStages: number,
  artifacts: number,
  chaptersComplete: number,
): Achievement[] {
  const earned: Achievement[] = [];
  if (completedStages >= 1) earned.push(mockAchievements[0]);
  if (chaptersComplete >= 1) earned.push(mockAchievements[1]);
  if (chaptersComplete >= 2) earned.push(mockAchievements[2]);
  if (chaptersComplete >= 3) earned.push(mockAchievements[3]);
  if (completedStages >= 12) earned.push(mockAchievements[4]);
  if (artifacts >= 6) earned.push(mockAchievements[5]);
  return earned;
}
