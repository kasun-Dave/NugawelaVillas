import { useQuery } from '@tanstack/react-query';
import { repositories } from '@/services/repository-registry';
import { Skeleton } from '@/components/ui/Skeleton';

export function AdminStagesPage() {
  const { data: stagesData, isLoading: stagesLoading } = useQuery({
    queryKey: ['adventure-stages'],
    queryFn: () => repositories.adventure.getStages(),
  });

  const { data: chaptersData } = useQuery({
    queryKey: ['adventure-chapters'],
    queryFn: () => repositories.adventure.getChapters(),
  });

  const stages = stagesData?.data ?? [];
  const chapters = chaptersData?.data ?? [];

  if (stagesLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Adventure Stages</h2>
        <p className="mt-1 text-sm text-charcoal-500">
          {stages.length} stages across {chapters.length} chapters — read-only overview for guides
          and staff.
        </p>
      </div>

      {chapters.map((chapter) => {
        const chapterStages = stages.filter((s) => s.chapterId === chapter.id);
        return (
          <section
            key={chapter.id}
            className="overflow-hidden rounded-2xl border border-mist-200 bg-white"
          >
            <div className="border-b border-mist-200 bg-mist/40 px-5 py-3">
              <h3 className="font-serif font-semibold text-charcoal">{chapter.title}</h3>
              <p className="mt-0.5 text-xs text-charcoal-500">{chapter.description}</p>
            </div>
            <ul className="divide-y divide-mist-100">
              {chapterStages.map((stage) => (
                <li key={stage.id} className="flex flex-wrap justify-between gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-forest">
                      Stage {stage.order} · {stage.locationName}
                    </p>
                    <h4 className="font-medium text-charcoal">{stage.title}</h4>
                    <p className="mt-1 line-clamp-2 text-sm text-charcoal-600">{stage.narrative}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-mist px-3 py-1">{stage.puzzle.type}</span>
                    <span className="rounded-full bg-mist px-3 py-1">{stage.locationType}</span>
                    {stage.daylightOnly ? (
                      <span className="text-gold-700 rounded-full bg-gold/10 px-3 py-1">
                        Daylight
                      </span>
                    ) : null}
                    <span className="rounded-full bg-mist px-3 py-1">
                      ~{stage.estimatedDurationMinutes}m
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
