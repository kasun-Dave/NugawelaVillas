import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { ImageWithFallback } from '@/components/ui/shared';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { ScrollReveal } from '@/components/motion/ScrollMotion';
import type { TravelRegion } from '@/types/travel';

export function FeaturedRegionsSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['travel', 'regions', 'featured'],
    queryFn: () => repositories.travel.getFeaturedRegions(),
  });

  const regions = (data?.data ?? []).slice(0, 6);

  if (isLoading) {
    return (
      <section className="section-padding bg-mist" aria-labelledby="regions-heading">
        <div className="container-narrow grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="section-padding bg-mist" aria-labelledby="regions-heading">
        <div className="container-narrow">
          <p className="text-terracotta" role="alert">
            Unable to load destinations.
          </p>
        </div>
      </section>
    );
  }

  return <RegionsScrollGallery regions={regions} />;
}

function RegionsScrollGallery({ regions }: { regions: TravelRegion[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.001,
  });

  const x = useTransform(progress, [0.05, 0.95], ['4vw', '-72%']);
  const headingY = useTransform(progress, [0, 0.2], [0, -24]);
  const headingOpacity = useTransform(progress, [0, 0.15, 0.85, 1], [1, 1, 0.85, 0.55]);
  const barScale = useTransform(progress, [0, 1], [0.08, 1]);

  return (
    <section className="relative bg-mist" aria-labelledby="regions-heading" ref={ref} style={{ height: '280vh' }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden bg-mist">
        <motion.div
          className="container-narrow px-4 sm:px-6 lg:px-8"
          style={reduce ? undefined : { y: headingY, opacity: headingOpacity }}
        >
          <ScrollReveal>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-forest">
              Destinations
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="regions-heading" className="heading-section">
                  Scroll through the island
                </h2>
                <p className="text-body mt-2 max-w-2xl">
                  Regions shaped by coast, highlands, wildlife, and living heritage — cards glide
                  with your scroll, like a guided path.
                </p>
              </div>
              <Link
                to="/destinations"
                className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2 text-sm font-medium text-ivory transition-colors hover:bg-forest-600"
              >
                All destinations <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </motion.div>

        <div className="mt-10">
          <motion.div
            className="flex w-max gap-6 px-[4vw] pb-8 will-change-transform"
            style={reduce ? undefined : { x }}
          >
            {regions.map((region, i) => (
              <article
                key={region.id}
                className="group relative w-[78vw] max-w-[420px] shrink-0 overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-sm sm:w-[380px]"
              >
                <Link to={`/destinations/${region.slug}`} className="block">
                  <div className="relative h-56 overflow-hidden sm:h-64">
                    <ImageWithFallback
                      src={region.images[0]}
                      alt={region.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 font-serif text-sm text-ivory/80">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="absolute bottom-4 left-4 right-4 font-serif text-2xl font-semibold text-ivory">
                      {region.name}
                    </h3>
                  </div>
                  <div className="p-5">
                    <p className="line-clamp-2 text-sm text-charcoal-600">{region.shortDescription}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-forest">
                      Explore <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </motion.div>
        </div>

        <div className="container-narrow mt-4 px-4 sm:px-6 lg:px-8">
          <div className="h-1 overflow-hidden rounded-full bg-forest/15" aria-hidden="true">
            <motion.div
              className="h-full origin-left rounded-full bg-gold"
              style={reduce ? undefined : { scaleX: barScale }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
