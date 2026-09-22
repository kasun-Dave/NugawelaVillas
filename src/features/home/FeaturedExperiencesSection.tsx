import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { SectionHeading, ImageWithFallback } from '@/components/ui/shared';
import { CardSkeleton } from '@/components/ui/Skeleton';

export function FeaturedExperiencesSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['experiences', 'featured'],
    queryFn: () => repositories.experiences.getFeatured(),
  });

  const experiences = data?.data ?? [];

  return (
    <section className="section-padding bg-ivory" aria-labelledby="experiences-heading">
      <div className="container-narrow">
        <SectionHeading
          title="Curated Experiences"
          subtitle="From dawn nature walks to campfire storytelling — immerse yourself in the valley."
          action={{ label: 'All Experiences', href: '/experiences' }}
        />

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <p className="mt-10 text-terracotta" role="alert">
            Unable to load experiences.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((exp) => (
              <article
                key={exp.id}
                className="group overflow-hidden rounded-2xl border border-mist-200 bg-white transition-shadow hover:shadow-md"
              >
                <Link to={`/experiences/${exp.slug}`}>
                  <ImageWithFallback src={exp.images[0]} alt={exp.name} className="h-48 w-full" />
                  <div className="p-5">
                    <span className="text-xs font-medium uppercase tracking-wider text-gold">
                      {exp.category}
                    </span>
                    <h3 className="mt-1 font-serif text-lg font-semibold text-charcoal transition-colors group-hover:text-forest">
                      {exp.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-charcoal-600">
                      {exp.shortDescription}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-charcoal-500">
                        <Clock className="h-3.5 w-3.5" />
                        {exp.durationMinutes} min
                      </span>
                      <span className="font-semibold text-forest">${exp.price}</span>
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
