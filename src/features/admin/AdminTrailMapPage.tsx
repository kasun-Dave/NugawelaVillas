import { useQuery } from '@tanstack/react-query';
import { repositories } from '@/services/repository-registry';
import { AdventureProgressMap } from '@/components/adventure/AdventureProgressMap';
import { Skeleton } from '@/components/ui/Skeleton';

export function AdminTrailMapPage() {
  const { data: stagesData, isLoading } = useQuery({
    queryKey: ['adventure-stages'],
    queryFn: () => repositories.adventure.getStages(),
  });

  const { data: chaptersData } = useQuery({
    queryKey: ['adventure-chapters'],
    queryFn: () => repositories.adventure.getChapters(),
  });

  const { data: progressData } = useQuery({
    queryKey: ['admin-guest-progress'],
    queryFn: () => repositories.admin.listGuestProgress(),
  });

  const stages = stagesData?.data ?? [];
  const chapters = chaptersData?.data ?? [];
  const guests = progressData?.data ?? [];

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Trail Map Overview</h2>
        <p className="mt-1 text-sm text-charcoal-500">
          Valley stage layout for field guides. {guests.length} guest
          {guests.length !== 1 ? 's' : ''} currently on the trail.
        </p>
      </div>

      <AdventureProgressMap stages={stages} progress={null} chapters={chapters} />

      {guests.length > 0 ? (
        <section className="rounded-2xl border border-mist-200 bg-white p-6">
          <h3 className="mb-4 font-serif font-semibold">Active Guests by Stage</h3>
          <ul className="space-y-2 text-sm">
            {guests
              .filter((g) => !g.isComplete)
              .map((g) => (
                <li
                  key={g.userId}
                  className="flex justify-between gap-4 border-b border-mist-100 py-2 last:border-0"
                >
                  <span className="font-medium text-charcoal">{g.guestName}</span>
                  <span className="text-charcoal-500">
                    {g.currentStageTitle ?? 'Starting'} · {g.completedStages}/{g.totalStages}
                    {g.paused ? ' · Paused' : ''}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
