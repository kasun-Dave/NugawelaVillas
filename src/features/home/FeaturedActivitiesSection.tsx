import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { SectionHeading, ImageWithFallback } from '@/components/ui/shared';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { ParallaxCard, ScrollReveal } from '@/components/motion/ScrollMotion';

export function FeaturedActivitiesSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['travel', 'activities', 'featured'],
    queryFn: () => repositories.travel.getFeaturedActivities(),
  });

  const activities = data?.data ?? [];

  return (
    <section className="section-padding bg-mist" aria-labelledby="activities-heading">
      <div className="container-narrow">
        <ScrollReveal>
          <SectionHeading
            title="Trending activities"
            subtitle="Hikes, wildlife drives, cultural immersions, and coastal adventures — cards drift as you scroll."
            action={{ label: 'All activities', href: '/activities' }}
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
            Unable to load activities.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activities.slice(0, 6).map((activity, i) => (
              <ParallaxCard key={activity.id} distance={40 + (i % 3) * 18} speed={0.85 + (i % 3) * 0.15}>
                <ScrollReveal delay={i * 0.06}>
                  <article className="group overflow-hidden rounded-2xl border border-mist-200 bg-white transition-shadow hover:shadow-md">
                    <Link to={`/activities/${activity.slug}`}>
                      <div className="overflow-hidden">
                        <ImageWithFallback
                          src={activity.images[0]}
                          alt={activity.name}
                          className="h-48 w-full transition duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <span className="text-xs font-medium uppercase tracking-wider text-gold">
                          {activity.kind}
                        </span>
                        <h3 className="mt-1 font-serif text-lg font-semibold text-charcoal transition-colors group-hover:text-forest">
                          {activity.name}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-charcoal-600">
                          {activity.shortDescription}
                        </p>
                        <div className="mt-4 flex items-center justify-between text-sm text-charcoal-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {activity.duration}
                          </span>
                          <span className="capitalize">{activity.difficulty}</span>
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
