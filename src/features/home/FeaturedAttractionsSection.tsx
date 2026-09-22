import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { SectionHeading, ImageWithFallback } from '@/components/ui/shared';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { ParallaxCard, ScrollReveal } from '@/components/motion/ScrollMotion';

export function FeaturedAttractionsSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['destinations', 'featured'],
    queryFn: () => repositories.destinations.getFeatured(),
  });

  const attractions = data?.data ?? [];

  return (
    <section className="section-padding bg-ivory" aria-labelledby="attractions-heading">
      <div className="container-narrow">
        <ScrollReveal>
          <SectionHeading
            title="Popular attractions"
            subtitle="Famous landmarks and standout places — each card eases into view as you move down the page."
            action={{ label: 'All attractions', href: '/attractions' }}
          />
        </ScrollReveal>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <p className="mt-10 text-terracotta" role="alert">
            Unable to load attractions.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {attractions.slice(0, 6).map((dest, i) => (
              <ParallaxCard
                key={dest.id}
                distance={i % 2 === 0 ? 36 : 64}
                speed={i % 2 === 0 ? 0.9 : 1.15}
              >
                <ScrollReveal delay={(i % 2) * 0.08} y={36}>
                  <article className="group flex gap-4 rounded-2xl border border-mist-200 bg-white p-4 transition-shadow hover:shadow-md">
                    <Link to={`/attractions/${dest.slug}`} className="flex min-w-0 flex-1 gap-4">
                      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl">
                        <ImageWithFallback
                          src={dest.images[0]}
                          alt={dest.name}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      </div>
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
                            {dest.cityName}
                          </span>
                          <span className="rounded-full bg-mist px-2 py-0.5 capitalize text-charcoal-600">
                            {dest.category.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                </ScrollReveal>
              </ParallaxCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
