import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { SectionHeading, ImageWithFallback } from '@/components/ui/shared';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { ParallaxCard, ScrollReveal } from '@/components/motion/ScrollMotion';

export function FeaturedGuidesSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['travel', 'guides', 'featured'],
    queryFn: () => repositories.travel.getFeaturedGuides(),
  });

  const guides = data?.data ?? [];

  return (
    <section className="section-padding bg-ivory" aria-labelledby="guides-heading">
      <div className="container-narrow">
        <ScrollReveal>
          <SectionHeading
            title="Featured travel guides"
            subtitle="Practical articles for first-timers, regional deep dives, and trip planning."
            action={{ label: 'All guides', href: '/guides' }}
          />
        </ScrollReveal>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <p className="mt-10 text-terracotta" role="alert">
            Unable to load guides.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.slice(0, 3).map((guide, i) => (
              <ParallaxCard key={guide.id} distance={48} speed={1 + i * 0.12}>
                <ScrollReveal delay={i * 0.1}>
                  <article className="group overflow-hidden rounded-2xl border border-mist-200 bg-white transition-shadow hover:shadow-md">
                    <Link to={`/guides/${guide.slug}`}>
                      <div className="overflow-hidden">
                        <ImageWithFallback
                          src={guide.images[0]}
                          alt={guide.title}
                          className="h-40 w-full transition duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gold">
                          <BookOpen className="h-3.5 w-3.5" />
                          {guide.topic.replace('_', ' ')}
                        </span>
                        <h3 className="mt-2 font-serif text-lg font-semibold text-charcoal transition-colors group-hover:text-forest">
                          {guide.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-charcoal-600">{guide.summary}</p>
                        <p className="mt-3 text-xs text-charcoal-500">{guide.readingMinutes} min read</p>
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
