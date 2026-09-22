import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { repositories } from '@/services/repository-registry';
import { SectionHeading } from '@/components/ui/shared';
import { Skeleton } from '@/components/ui/Skeleton';
import { ScrollReveal } from '@/components/motion/ScrollMotion';

export function LatestUpdatesSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['travel', 'updates'],
    queryFn: () => repositories.travel.getUpdates(),
  });

  const updates = (data?.data ?? []).slice(0, 4);

  return (
    <section className="section-padding bg-mist" aria-labelledby="updates-heading">
      <div className="container-narrow">
        <ScrollReveal>
          <SectionHeading
            title="Latest travel updates"
            subtitle="Seasonal notes, park advisories, festivals, and practical travel news."
            action={{ label: 'All updates', href: '/updates' }}
          />
        </ScrollReveal>

        {isLoading ? (
          <div className="mt-10 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <p className="mt-10 text-terracotta" role="alert">
            Unable to load updates.
          </p>
        ) : (
          <ul className="mt-10 space-y-3">
            {updates.map((update, i) => (
              <ScrollReveal key={update.id} delay={i * 0.06} y={28}>
                <li>
                  <Link
                    to={`/updates/${update.slug}`}
                    className="flex flex-col gap-1 rounded-2xl border border-mist-200 bg-white px-5 py-4 transition hover:border-forest/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-gold">
                        {update.category}
                      </span>
                      <h3 className="font-serif text-lg font-semibold text-charcoal">{update.title}</h3>
                      <p className="mt-1 line-clamp-1 text-sm text-charcoal-600">{update.summary}</p>
                    </div>
                    <time
                      className="shrink-0 text-xs text-charcoal-500"
                      dateTime={update.publishedAt}
                    >
                      {new Date(update.publishedAt).toLocaleDateString('en-LK', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </Link>
                </li>
              </ScrollReveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
