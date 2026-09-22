import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Shield, Clock } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { repositories } from '@/services/repository-registry';
import { PuzzlePlayer } from '@/components/adventure/PuzzlePlayer';
import { ArtifactCard } from '@/components/adventure/ArtifactCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { getStageStatus, getNextStage } from '@/utils/adventure-unlock';
import { showToast } from '@/components/ui/toast-utils';

export function StagePlayPage() {
  const { stageId } = useParams<{ stageId: string }>();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: stageData, isLoading: stageLoading } = useQuery({
    queryKey: ['adventure-stage', stageId],
    queryFn: () => repositories.adventure.getStageById(stageId!),
    enabled: !!stageId,
  });

  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ['adventure-progress', user?.id],
    queryFn: () => repositories.adventure.getProgress(user!.id),
    enabled: !!user,
  });

  const { data: stagesData } = useQuery({
    queryKey: ['adventure-stages'],
    queryFn: () => repositories.adventure.getStages(),
  });

  const stage = stageData?.data;
  const progress = progressData?.data;
  const stages = stagesData?.data ?? [];

  if (stageLoading || progressLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!stage) {
    return (
      <div className="py-12 text-center">
        <p className="text-charcoal-600">Stage not found.</p>
        <Button className="mt-4" asChild>
          <Link to="/adventure/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="py-12 text-center">
        <p className="text-charcoal-600">Enter your adventure code to play stages.</p>
        <Button className="mt-4" asChild>
          <Link to="/adventure/play">Enter Code</Link>
        </Button>
      </div>
    );
  }

  const status = getStageStatus(stage, progress);
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';
  const nextStage = isCompleted ? getNextStage(stages, progress) : null;

  const handleSubmit = async (answer: string | number | number[]) => {
    const result = await repositories.adventure.submitAnswer(
      user!.id,
      stage.id,
      answer as string | number[],
    );
    if (result.error) {
      showToast(result.error, 'error');
      return { correct: false, message: result.error };
    }
    if (result.data.correct) {
      queryClient.invalidateQueries({ queryKey: ['adventure-progress', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['adventure-achievements', user?.id] });
      showToast('Stage complete! Artifact collected.', 'success');
    }
    return {
      correct: result.data.correct,
      message: result.data.message ?? (result.data.correct ? 'Correct!' : undefined),
    };
  };

  const handleHint = async (level: number) => {
    const result = await repositories.adventure.requestHint(user!.id, stage.id, level);
    if (result.error) {
      showToast(result.error, 'error');
      return null;
    }
    queryClient.invalidateQueries({ queryKey: ['adventure-progress', user?.id] });
    return result.data.text;
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/adventure/dashboard">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Dashboard
        </Link>
      </Button>

      <header>
        <p className="text-xs font-medium uppercase tracking-wide text-forest">
          Stage {stage.order}
        </p>
        <h1 className="font-serif text-3xl font-semibold text-charcoal">{stage.title}</h1>
      </header>

      <div className="adventure-panel space-y-4 rounded-xl p-6">
        <p className="text-body leading-relaxed">{stage.narrative}</p>
        {stage.isFictionalStory ? (
          <p className="border-t border-mist-100 pt-3 text-xs text-charcoal-400">
            Fiction — this story element is part of the adventure narrative, not historical fact.
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
        <InfoChip icon={<MapPin className="h-4 w-4" />} label={stage.locationName} />
        <InfoChip
          icon={<Clock className="h-4 w-4" />}
          label={`~${stage.estimatedDurationMinutes} min`}
        />
        <InfoChip
          icon={<Shield className="h-4 w-4" />}
          label={stage.daylightOnly ? 'Daylight only' : 'Any time'}
        />
      </div>

      <div className="adventure-panel adventure-text rounded-xl p-4 text-sm">
        <p className="font-medium text-charcoal">Safety</p>
        <p className="mt-1 text-charcoal-600">{stage.safetyNote}</p>
        <p className="mt-2 text-xs text-charcoal-500">{stage.accessibilityNotes}</p>
      </div>

      {isLocked ? (
        <div className="adventure-panel--soft rounded-xl p-6 text-center">
          <p className="text-charcoal-600">This stage is locked. Complete previous stages first.</p>
          <Button className="mt-4" asChild>
            <Link to="/adventure/dashboard">View Progress</Link>
          </Button>
        </div>
      ) : null}

      {isCompleted ? (
        <div className="space-y-4">
          <ArtifactCard artifact={stage.artifact} collected />
          <p className="text-sm italic text-charcoal-600">{stage.storyFragment}</p>
          {nextStage ? (
            <Button asChild>
              <Link to={`/adventure/stage/${nextStage.id}`}>Next Stage: {nextStage.title}</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/adventure/dashboard">Return to Dashboard</Link>
            </Button>
          )}
        </div>
      ) : null}

      {!isLocked && !isCompleted ? (
        <div className="adventure-panel rounded-2xl p-6">
          <PuzzlePlayer
            stage={stage}
            onSubmit={handleSubmit}
            onRequestHint={handleHint}
            disabled={progress.paused}
          />
        </div>
      ) : null}
    </div>
  );
}

function InfoChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="adventure-panel adventure-text flex items-center gap-2 rounded-lg px-3 py-2">
      <span className="text-forest">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
