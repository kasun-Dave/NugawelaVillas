import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Mountain } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { ImageWithFallback } from '@/components/ui/shared';

export function TrailsListingPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['travel', 'trails'],
    queryFn: () => repositories.travel.getTrails(),
  });
  const trails = data?.data ?? [];

  return (
    <div className="section-padding min-h-screen bg-ivory">
      <div className="container-narrow">
        <h1 className="heading-section">Trails</h1>
        <p className="text-body mt-2 max-w-2xl">
          Hiking routes from gentle viewpoint walks to sacred summit climbs — with distance,
          difficulty, and safety notes.
        </p>
        {isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <p className="mt-8 text-terracotta">Unable to load trails.</p>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trails.map((trail) => (
              <li key={trail.id}>
                <Link
                  to={`/trails/${trail.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-mist-200 bg-white transition hover:border-forest/30"
                >
                  <div className="relative h-44 overflow-hidden">
                    <ImageWithFallback
                      src={trail.images[0]}
                      alt={trail.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-forest">
                      {trail.difficulty} · {trail.distanceKm} km
                    </p>
                    <h2 className="mt-1 font-serif text-xl font-semibold">{trail.name}</h2>
                    <p className="mt-2 flex-1 text-sm text-charcoal-600">{trail.shortDescription}</p>
                    <p className="mt-3 flex items-center gap-1 text-xs text-charcoal-500">
                      <Mountain className="h-3.5 w-3.5" /> +{trail.elevationGainM} m ·{' '}
                      {trail.durationHours} h
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-forest">
                      Trail details <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
