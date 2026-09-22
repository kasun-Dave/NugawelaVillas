import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Pause, Play, Phone, Sparkles, Trophy } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { repositories } from '@/services/repository-registry';
import { AdventureProgressMap } from '@/components/adventure/AdventureProgressMap';
import { ArtifactCard } from '@/components/adventure/ArtifactCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { showToast } from '@/components/ui/toast-utils';
import { isAdventureComplete } from '@/utils/adventure-unlock';

export function AdventureDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ['adventure-progress', user?.id],
    queryFn: () => repositories.adventure.getProgress(user!.id),
    enabled: !!user,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const { data: stagesData } = useQuery({
    queryKey: ['adventure-stages'],
    queryFn: () => repositories.adventure.getStages(),
  });

  const { data: chaptersData } = useQuery({
    queryKey: ['adventure-chapters'],
    queryFn: () => repositories.adventure.getChapters(),
  });

  const { data: achievementsData } = useQuery({
    queryKey: ['adventure-achievements', user?.id],
    queryFn: () => repositories.adventure.getAchievements(user!.id),
    enabled: !!user && !!progressData?.data,
  });

  const progress = progressData?.data;
  const stages = stagesData?.data ?? [];
  const chapters = chaptersData?.data ?? [];
  const achievements = achievementsData?.data ?? [];

  if (progressLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="adventure-panel mx-auto max-w-lg rounded-2xl p-8 text-center">
        <Sparkles className="mx-auto mb-4 h-10 w-10 text-gold" />
        <h2 className="mb-2 font-serif text-2xl font-semibold">No Active Adventure</h2>
        <p className="text-body mb-6">Enter your welcome card code to begin The Hidden Trail.</p>
        <Button asChild>
          <Link to="/adventure/play">Enter Adventure Code</Link>
        </Button>
      </div>
    );
  }

  const complete = isAdventureComplete(stages, progress);
  const currentStage = stages.find((s) => s.id === progress.currentStageId);

  const handlePauseResume = async () => {
    const action = progress.paused ? 'resumeAdventure' : 'pauseAdventure';
    const result = await repositories.adventure[action](user!.id);
    if (result.error) {
      showToast(result.error, 'error');
      return;
    }
    showToast(progress.paused ? 'Adventure resumed' : 'Adventure paused', 'success');
    queryClient.invalidateQueries({ queryKey: ['adventure-progress', user?.id] });
  };

  return (
    <div className="space-y-8">
      {progress.paused ? (
        <div className="adventure-panel adventure-text rounded-xl p-4 text-sm">
          Your adventure is paused. Resume when you are ready to continue exploring.
        </div>
      ) : null}

      {complete ? (
        <div className="adventure-panel rounded-2xl p-6 text-center">
          <Trophy className="mx-auto mb-3 h-10 w-10 text-gold" />
          <h2 className="font-serif text-2xl font-semibold">Trail Complete!</h2>
          <p className="text-body mt-2">
            You have reunited all keeper tokens and completed The Hidden Trail.
          </p>
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="adventure-heading font-serif text-xl font-semibold">
              Valley Progress Map
            </h2>
            <span className="text-sm text-charcoal-500">
              {progress.completedStageIds.length}/{stages.length} stages
            </span>
          </div>
          <AdventureProgressMap
            stages={stages}
            progress={progress}
            chapters={chapters}
            onStageClick={(id) => navigate(`/adventure/stage/${id}`)}
          />
        </div>

        <div className="space-y-4">
          <h2 className="adventure-heading mb-4 font-serif text-xl font-semibold">Current Stage</h2>
          {currentStage ? (
            <div className="adventure-panel rounded-2xl p-6">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-forest">
                {chapters.find((c) => c.id === currentStage.chapterId)?.title}
              </p>
              <h3 className="font-serif text-lg font-semibold">{currentStage.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-charcoal-600">
                {currentStage.narrative}
              </p>
              <Button className="mt-4 w-full" asChild disabled={progress.paused}>
                <Link to={`/adventure/stage/${currentStage.id}`}>Continue Stage</Link>
              </Button>
            </div>
          ) : (
            <p className="text-sm text-charcoal-500">All stages completed.</p>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={handlePauseResume}>
              {progress.paused ? (
                <Play className="mr-1 h-4 w-4" />
              ) : (
                <Pause className="mr-1 h-4 w-4" />
              )}
              {progress.paused ? 'Resume' : 'Pause'}
            </Button>
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href="tel:+94112345678">
                <Phone className="mr-1 h-4 w-4" />
                Contact Guide
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="adventure-heading mb-4 font-serif text-xl font-semibold">Story Timeline</h2>
        <ol className="space-y-3">
          {stages
            .filter((s) => progress.completedStageIds.includes(s.id))
            .map((s) => (
              <li key={s.id} className="adventure-panel rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-gold">Stage {s.order} complete</p>
                    <h4 className="font-medium text-charcoal">{s.title}</h4>
                    <p className="mt-1 text-sm italic text-charcoal-600">{s.storyFragment}</p>
                  </div>
                  <Link
                    to={`/adventure/stage/${s.id}`}
                    className="shrink-0 text-xs text-forest hover:underline"
                  >
                    Review
                  </Link>
                </div>
              </li>
            ))}
        </ol>
        {progress.completedStageIds.length === 0 ? (
          <p className="text-sm text-charcoal-500">
            Complete your first stage to unlock story fragments.
          </p>
        ) : null}
      </section>

      <section>
        <h2 className="adventure-heading mb-4 font-serif text-xl font-semibold">
          Artifact Collection
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {stages.map((s) => (
            <ArtifactCard
              key={s.artifact.id}
              artifact={s.artifact}
              collected={progress.artifactIds.includes(s.artifact.id)}
              compact
            />
          ))}
        </div>
      </section>

      {achievements.length > 0 ? (
        <section>
          <h2 className="mb-4 font-serif text-xl font-semibold">Achievements</h2>
          <div className="flex flex-wrap gap-3">
            {achievements.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-sm"
              >
                <span>{a.icon}</span>
                <span className="font-medium">{a.name}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
