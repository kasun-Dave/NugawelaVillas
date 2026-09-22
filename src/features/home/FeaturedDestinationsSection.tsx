import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Clock } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { SectionHeading, ImageWithFallback } from '@/components/ui/shared';
import { CardSkeleton } from '@/components/ui/Skeleton';

export function FeaturedDestinationsSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['destinations', 'featured'],
    queryFn: () => repositories.destinations.getFeatured(),
  });

  const destinations = data?.data ?? [];

  return (
    <section
      id="location"
      className="section-padding bg-mist"
      aria-labelledby="destinations-heading"
    >
      <div className="container-narrow">
        <SectionHeading
          title="Nearby Destinations"
          subtitle="Explore the hill country beyond the resort — villages, viewpoints, temples, and hidden waterfalls."
          action={{ label: 'All Destinations', href: '/destinations' }}
        />

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <p className="mt-10 text-terracotta" role="alert">
            Unable to load destinations.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {destinations.map((dest) => (
              <article
                key={dest.id}
                className="group flex gap-4 rounded-2xl border border-mist-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <Link to={`/destinations/${dest.slug}`} className="flex min-w-0 flex-1 gap-4">
                  <ImageWithFallback
                    src={dest.images[0]}
                    alt={dest.name}
                    className="h-28 w-28 shrink-0 rounded-xl"
                  />
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg font-semibold text-charcoal transition-colors group-hover:text-forest">
                      {dest.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-charcoal-600">
                      {dest.shortDescription}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-charcoal-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {dest.distanceKm} km
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {dest.travelTimeMinutes} min
                      </span>
                      <span className="rounded-full bg-mist px-2 py-0.5 capitalize text-charcoal-600">
                        {dest.difficulty}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
