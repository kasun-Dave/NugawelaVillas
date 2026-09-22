import type { AdventureStage, AdventureProgress } from '@/types/adventure';

export type StageStatus = 'locked' | 'available' | 'completed';

export function getStageStatus(
  stage: AdventureStage,
  progress: AdventureProgress | null,
): StageStatus {
  if (!progress) return stage.order === 1 ? 'available' : 'locked';

  if (progress.completedStageIds.includes(stage.id)) return 'completed';

  if (!stage.unlockRequirement.previousStageId) return 'available';

  const prevCompleted = progress.completedStageIds.includes(
    stage.unlockRequirement.previousStageId,
  );
  return prevCompleted ? 'available' : 'locked';
}

export function getAvailableStages(
  stages: AdventureStage[],
  progress: AdventureProgress | null,
): AdventureStage[] {
  return stages.filter((s) => getStageStatus(s, progress) === 'available');
}

export function getNextStage(
  stages: AdventureStage[],
  progress: AdventureProgress,
): AdventureStage | null {
  const sorted = [...stages].sort((a, b) => a.order - b.order);
  for (const stage of sorted) {
    if (!progress.completedStageIds.includes(stage.id)) {
      const status = getStageStatus(stage, progress);
      if (status === 'available') return stage;
    }
  }
  return null;
}

export function isChapterComplete(
  chapterId: string,
  stages: AdventureStage[],
  progress: AdventureProgress,
): boolean {
  const chapterStages = stages.filter((s) => s.chapterId === chapterId);
  return chapterStages.every((s) => progress.completedStageIds.includes(s.id));
}

export function isAdventureComplete(
  stages: AdventureStage[],
  progress: AdventureProgress,
): boolean {
  return stages.every((s) => progress.completedStageIds.includes(s.id));
}

export function passesSafetyGate(stage: AdventureStage, isDaylight: boolean): boolean {
  if (stage.daylightOnly && !isDaylight) {
    return false;
  }
  return true;
}

export function isDaylightHour(): boolean {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18;
}
