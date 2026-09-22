import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import type { TravelRegion } from '@/types/travel';

export function DestinationChaptersSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['travel', 'regions', 'featured'],
    queryFn: () => repositories.travel.getFeaturedRegions(),
  });
  const regions = (data?.data ?? []).slice(0, 5);

  if (isLoading || regions.length === 0) {
    return (
      <section className="flex h-[50vh] items-center justify-center bg-charcoal text-ivory/60">
        Loading destinations…
      </section>
    );
  }

  return <CinematicChapters regions={regions} />;
}

function CinematicChapters({ regions }: { regions: TravelRegion[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 22,
    restDelta: 0.001,
  });

  useEffect(() => {
    return progress.on('change', (v) => {
      // Hold each chapter for a clear beat while scrolling
      const next = Math.min(
        regions.length - 1,
        Math.floor(v * regions.length * 0.999),
      );
      setIndex((prev) => (prev === next ? prev : next));
    });
  }, [progress, regions.length]);

  const region = regions[index];
  const kenBurns = useTransform(progress, [0, 1], [1.06, 1.14]);
  const barScale = useTransform(progress, [0, 1], [0.12, 1]);

  return (
    <section
      ref={ref}
      className="relative bg-charcoal"
      style={{ height: `${regions.length * 110}vh` }}
      aria-labelledby="chapters-heading"
    >
      <h2 id="chapters-heading" className="sr-only">
        Destination chapters
      </h2>

      {/* One stage — chapters animate in place as you scroll */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={reduce ? undefined : { scale: kenBurns }}>
          <AnimatePresence mode="sync" initial={false}>
            <motion.img
              key={region.id}
              src={region.images[0]}
              alt={region.name}
              className="absolute inset-0 h-full w-full object-cover"
              initial={
                reduce
                  ? false
                  : { opacity: 0, scale: 1.12, filter: 'blur(14px)' }
              }
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={
                reduce
                  ? undefined
                  : { opacity: 0, scale: 1.04, filter: 'blur(8px)' }
              }
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
              loading="eager"
            />
          </AnimatePresence>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-transparent to-charcoal/30" />

        <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-16 pt-28 sm:px-8 lg:px-16">
          <div className="max-w-3xl overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={region.id}
                initial={reduce ? false : { opacity: 0, y: 56 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -40 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.p
                  className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-gold"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  Destinations · {String(index + 1).padStart(2, '0')} /{' '}
                  {String(regions.length).padStart(2, '0')}
                </motion.p>

                <h3 className="overflow-hidden font-serif text-4xl font-semibold text-ivory sm:text-6xl lg:text-7xl">
                  <motion.span
                    className="block"
                    initial={reduce ? false : { y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {region.name}
                  </motion.span>
                </h3>

                <motion.p
                  className="mt-5 max-w-xl text-base leading-relaxed text-ivory/85 sm:text-lg"
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.55 }}
                >
                  {region.shortDescription}
                </motion.p>

                <motion.p
                  className="mt-5 max-w-2xl text-sm tracking-wide text-ivory/65 sm:text-base"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.28, duration: 0.5 }}
                >
                  {region.highlights.slice(0, 4).join('  ·  ')}
                </motion.p>

                <motion.div
                  className="mt-8"
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                >
                  <Link
                    to={`/destinations/${region.slug}`}
                    className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-gold transition hover:text-ivory"
                  >
                    Enter this chapter
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-12 h-px max-w-md overflow-hidden bg-ivory/20">
            <motion.div
              className="h-full origin-left bg-gold"
              style={reduce ? { width: `${((index + 1) / regions.length) * 100}%` } : { scaleX: barScale }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
