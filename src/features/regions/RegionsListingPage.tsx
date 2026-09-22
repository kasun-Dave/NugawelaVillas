import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, MapPin } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { ImageWithFallback } from '@/components/ui/shared';

export function RegionsListingPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['travel', 'regions'],
    queryFn: () => repositories.travel.getRegions(),
  });
  const regions = data?.data ?? [];

  return (
    <div className="section-padding min-h-screen bg-ivory">
      <div className="container-narrow">
        <h1 className="heading-section">Destinations</h1>
        <p className="text-body mt-2 max-w-2xl">
          Explore Sri Lanka by region — cultural capitals, tea highlands, wild parks, and living
          coasts.
        </p>

        {isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <p className="mt-8 text-terracotta">Unable to load destinations.</p>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regions.map((region) => (
              <li key={region.id}>
                <Link
                  to={`/destinations/${region.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-mist-200 bg-white transition hover:border-forest/30 hover:shadow-sm"
                >
                  <div className="relative h-44 overflow-hidden">
                    <ImageWithFallback
                      src={region.images[0]}
                      alt={region.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="font-serif text-xl font-semibold text-charcoal">{region.name}</h2>
                    <p className="mt-2 flex-1 text-sm text-charcoal-600">{region.shortDescription}</p>
                    <p className="mt-3 flex items-center gap-1 text-xs text-charcoal-500">
                      <MapPin className="h-3.5 w-3.5 text-terracotta" />
                      {region.highlights.slice(0, 2).join(' · ')}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-forest">
                      Explore region <ArrowRight className="h-4 w-4" />
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
