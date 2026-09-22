import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { repositories } from '@/services/repository-registry';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ImageWithFallback } from '@/components/ui/shared';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function ActivityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['travel', 'activity', slug],
    queryFn: () => repositories.travel.getActivityBySlug(slug!),
    enabled: !!slug,
  });
  const act = data?.data;
  useDocumentTitle(act?.name);

  const { data: regionsData } = useQuery({
    queryKey: ['travel', 'regions'],
    queryFn: () => repositories.travel.getRegions(),
  });
  const { data: activitiesData } = useQuery({
    queryKey: ['travel', 'activities'],
    queryFn: () => repositories.travel.getActivities(),
  });

  const relatedRegions = (regionsData?.data ?? []).filter((r) =>
    act?.nearbyRegionIds.includes(r.id),
  );
  const similar = (activitiesData?.data ?? [])
    .filter((a) => a.id !== act?.id && a.kind === act?.kind)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="section-padding container-narrow space-y-4">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }
  if (!act) {
    return (
      <div className="section-padding container-narrow py-16 text-center">
        <h1 className="heading-section mb-4">Activity Not Found</h1>
        <Button asChild>
          <Link to="/activities">All Activities</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="relative h-64 sm:h-80">
        <ImageWithFallback src={act.images[0]} alt={act.name} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
        <div className="container-narrow absolute bottom-0 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-widest text-gold">
            {act.kind} · {act.difficulty}
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-ivory sm:text-4xl">{act.name}</h1>
        </div>
      </div>
      <div className="section-padding container-narrow grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <p className="text-body leading-relaxed">{act.overview}</p>
          <section>
            <h2 className="font-serif text-xl font-semibold">What to bring</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {act.whatToBring.map((item) => (
                <li key={item} className="rounded-xl border border-mist-200 bg-white px-3 py-2 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold">Safety</h2>
            <ul className="mt-3 space-y-2 text-sm text-charcoal-600">
              {act.safety.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </section>
          {similar.length > 0 ? (
            <section>
              <h2 className="font-serif text-xl font-semibold">Similar activities</h2>
              <ul className="mt-3 space-y-2">
                {similar.map((a) => (
                  <li key={a.id}>
                    <Link
                      to={`/activities/${a.slug}`}
                      className="text-sm font-medium text-forest hover:underline"
                    >
                      {a.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-mist-200 bg-white p-5 text-sm">
            <p>
              <span className="font-medium">Duration:</span> {act.duration}
            </p>
            <p className="mt-2">
              <span className="font-medium">Best season:</span> {act.bestSeason}
            </p>
            <p className="mt-2">
              <span className="font-medium">Difficulty:</span> {act.difficulty}
            </p>
          </div>
          {relatedRegions.length > 0 ? (
            <div className="rounded-2xl border border-mist-200 bg-white p-5">
              <h2 className="font-serif text-lg font-semibold">Related regions</h2>
              <ul className="mt-3 space-y-2">
                {relatedRegions.map((r) => (
                  <li key={r.id}>
                    <Link
                      to={`/destinations/${r.slug}`}
                      className="text-sm font-medium text-forest hover:underline"
                    >
                      {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <Button asChild className="w-full">
            <Link to="/destinations">Browse destinations</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/trails">Related trails</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
