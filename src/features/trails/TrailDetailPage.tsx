import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { repositories } from '@/services/repository-registry';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ImageWithFallback } from '@/components/ui/shared';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function TrailDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['travel', 'trail', slug],
    queryFn: () => repositories.travel.getTrailBySlug(slug!),
    enabled: !!slug,
  });
  const trail = data?.data;
  useDocumentTitle(trail?.name);

  const { data: regionsData } = useQuery({
    queryKey: ['travel', 'regions'],
    queryFn: () => repositories.travel.getRegions(),
  });
  const region = (regionsData?.data ?? []).find((r) => r.id === trail?.regionId);

  const { data: guidesData } = useQuery({
    queryKey: ['travel', 'guides', 'featured'],
    queryFn: () => repositories.travel.getFeaturedGuides(),
  });
  const guides = (guidesData?.data ?? []).slice(0, 2);

  if (isLoading) {
    return (
      <div className="section-padding container-narrow">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }
  if (!trail) {
    return (
      <div className="section-padding container-narrow py-16 text-center">
        <h1 className="heading-section mb-4">Trail Not Found</h1>
        <Button asChild>
          <Link to="/trails">All Trails</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="relative h-64 sm:h-80">
        <ImageWithFallback src={trail.images[0]} alt={trail.name} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
        <div className="container-narrow absolute bottom-0 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-widest text-gold">{trail.difficulty} trail</p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-ivory sm:text-4xl">
            {trail.name}
          </h1>
        </div>
      </div>
      <div className="section-padding container-narrow grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <p className="text-body leading-relaxed">{trail.overview}</p>
          <section>
            <h2 className="font-serif text-xl font-semibold">Scenic highlights</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {trail.scenicHighlights.map((h) => (
                <li key={h} className="rounded-full bg-mist px-3 py-1 text-xs font-medium">
                  {h}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold">Safety advice</h2>
            <ul className="mt-3 space-y-2 text-sm text-charcoal-600">
              {trail.safetyAdvice.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold">Nearby attractions</h2>
            <ul className="mt-3 space-y-1 text-sm text-charcoal-600">
              {trail.nearbyAttractionHints.map((n) => (
                <li key={n}>• {n}</li>
              ))}
            </ul>
            <Button variant="outline" asChild className="mt-4">
              <Link to="/attractions">Browse attractions</Link>
            </Button>
          </section>
        </div>
        <aside className="h-fit space-y-4">
          <div className="space-y-2 rounded-2xl border border-mist-200 bg-white p-5 text-sm">
            <p>
              <span className="font-medium">Distance:</span> {trail.distanceKm} km
            </p>
            <p>
              <span className="font-medium">Duration:</span> ~{trail.durationHours} hours
            </p>
            <p>
              <span className="font-medium">Elevation gain:</span> {trail.elevationGainM} m
            </p>
            <p>
              <span className="font-medium">Best season:</span> {trail.bestSeason}
            </p>
          </div>
          {region ? (
            <div className="rounded-2xl border border-mist-200 bg-white p-5">
              <h2 className="font-serif text-lg font-semibold">Related region</h2>
              <Link
                to={`/destinations/${region.slug}`}
                className="mt-2 block text-sm font-medium text-forest hover:underline"
              >
                {region.name}
              </Link>
              <p className="mt-1 text-xs text-charcoal-500">{region.shortDescription}</p>
            </div>
          ) : null}
          {guides.length > 0 ? (
            <div className="rounded-2xl border border-mist-200 bg-white p-5">
              <h2 className="font-serif text-lg font-semibold">Related guides</h2>
              <ul className="mt-3 space-y-2">
                {guides.map((g) => (
                  <li key={g.id}>
                    <Link
                      to={`/guides/${g.slug}`}
                      className="text-sm font-medium text-forest hover:underline"
                    >
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
