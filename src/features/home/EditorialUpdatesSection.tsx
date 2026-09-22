import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { repositories } from '@/services/repository-registry';
import { ScrollReveal, ParallaxCard } from '@/components/motion/ScrollMotion';

export function EditorialUpdatesSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['travel', 'updates'],
    queryFn: () => repositories.travel.getUpdates(),
  });
  const updates = (data?.data ?? []).slice(0, 4);

  return (
    <section className="bg-mist py-24 sm:py-32" aria-labelledby="updates-cinematic-heading">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-forest">
                Travel updates
              </p>
              <h2
                id="updates-cinematic-heading"
                className="font-serif text-4xl font-semibold text-charcoal sm:text-5xl"
              >
                Notes from the road
              </h2>
            </div>
            <Link
              to="/updates"
              className="text-sm font-medium text-forest underline-offset-4 hover:underline"
            >
              All updates
            </Link>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <p className="mt-12 text-charcoal-500">Loading updates…</p>
        ) : isError ? (
          <p className="mt-12 text-terracotta">Unable to load updates.</p>
        ) : (
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {updates.map((update, i) => (
              <ParallaxCard key={update.id} distance={24 + (i % 2) * 18} speed={1}>
                <ScrollReveal delay={i * 0.06} y={28}>
                  <Link
                    to={`/updates/${update.slug}`}
                    className="group flex h-full flex-col justify-between rounded-[1.5rem] border border-mist-200 bg-white/80 p-7 transition hover:border-forest/25 hover:bg-white"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
                          {update.category}
                        </span>
                        <time
                          className="text-xs text-charcoal-400"
                          dateTime={update.publishedAt}
                        >
                          {new Date(update.publishedAt).toLocaleDateString('en-LK', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      </div>
                      <h3 className="mt-4 font-serif text-2xl font-semibold text-charcoal transition group-hover:text-forest">
                        {update.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
                        {update.summary}
                      </p>
                    </div>
                    <span className="mt-6 text-sm font-medium text-forest">Read update →</span>
                  </Link>
                </ScrollReveal>
              </ParallaxCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
