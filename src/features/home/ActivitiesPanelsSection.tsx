import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import { repositories } from '@/services/repository-registry';
import { ScrollReveal } from '@/components/motion/ScrollMotion';

const KIND_FALLBACK = [
  { name: 'Hiking', kind: 'hiking', href: '/activities' },
  { name: 'Wildlife safaris', kind: 'wildlife', href: '/wildlife' },
  { name: 'Surfing', kind: 'water', href: '/beaches' },
  { name: 'Train journeys', kind: 'train', href: '/activities' },
  { name: 'Tea country', kind: 'culture', href: '/destinations/hill-country' },
  { name: 'Cultural immersions', kind: 'culture', href: '/heritage' },
];

export function ActivitiesPanelsSection() {
  const reduce = useReducedMotion();
  const { data } = useQuery({
    queryKey: ['travel', 'activities', 'featured'],
    queryFn: () => repositories.travel.getFeaturedActivities(),
  });
  const activities = (data?.data ?? []).slice(0, 6);

  const panels =
    activities.length > 0
      ? activities.map((a) => ({
          title: a.name,
          kind: a.kind,
          body: a.shortDescription,
          image: a.images[0],
          href: `/activities/${a.slug}`,
        }))
      : KIND_FALLBACK.map((k) => ({
          title: k.name,
          kind: k.kind,
          body: 'Open this path across the island.',
          image: '',
          href: k.href,
        }));

  return (
    <section className="bg-mist py-24 sm:py-32" aria-labelledby="activities-cinematic-heading">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-forest">
            Experiences
          </p>
          <h2
            id="activities-cinematic-heading"
            className="max-w-3xl font-serif text-4xl font-semibold text-charcoal sm:text-5xl lg:text-6xl"
          >
            Ways to move through the island
          </h2>
        </ScrollReveal>

        <div className="mt-14 space-y-4">
          {panels.map((panel, i) => (
            <ScrollReveal key={panel.title} delay={i * 0.04} y={32}>
              <Link
                to={panel.href}
                className="group relative flex min-h-[140px] overflow-hidden rounded-[1.5rem] bg-charcoal sm:min-h-[180px]"
              >
                {panel.image ? (
                  <motion.img
                    src={panel.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:opacity-85 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/70 to-transparent" />
                <div className="relative z-10 flex w-full flex-col justify-center gap-2 px-6 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-10">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gold">{panel.kind}</p>
                    <h3 className="mt-2 font-serif text-2xl font-semibold text-ivory sm:text-4xl">
                      <motion.span
                        className="inline-block"
                        whileHover={reduce ? undefined : { x: 8 }}
                        transition={{ duration: 0.4 }}
                      >
                        {panel.title}
                      </motion.span>
                    </h3>
                    <p className="mt-2 max-w-xl text-sm text-ivory/75 sm:text-base">{panel.body}</p>
                  </div>
                  <span className="mt-4 text-sm font-medium text-gold transition group-hover:translate-x-1 sm:mt-0">
                    Discover →
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-10 text-center">
          <Link
            to="/activities"
            className="inline-flex rounded-full border border-forest/30 px-6 py-3 text-sm font-medium text-forest transition hover:bg-forest hover:text-ivory"
          >
            View all activities
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
