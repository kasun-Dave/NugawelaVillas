import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ScrollReveal } from '@/components/motion/ScrollMotion';

type Hotspot = {
  id: string;
  label: string;
  x: number;
  y: number;
  href: string;
  kind: string;
};

const hotspots: Hotspot[] = [
  { id: 'north', label: 'Jaffna & North', x: 48, y: 12, href: '/destinations', kind: 'Heritage' },
  { id: 'triangle', label: 'Cultural Triangle', x: 52, y: 32, href: '/heritage', kind: 'Heritage' },
  { id: 'hills', label: 'Hill Country', x: 55, y: 48, href: '/destinations/hill-country', kind: 'Trails' },
  { id: 'east', label: 'East Coast', x: 72, y: 42, href: '/beaches', kind: 'Beaches' },
  { id: 'south', label: 'South Coast', x: 48, y: 78, href: '/beaches', kind: 'Beaches' },
  { id: 'wildlife', label: 'Wildlife Parks', x: 62, y: 68, href: '/wildlife', kind: 'Nature' },
  { id: 'west', label: 'West Coast', x: 32, y: 52, href: '/beaches', kind: 'Coast' },
];

export function IslandMapPreviewSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 28 });
  const floatY = useTransform(progress, [0, 1], [40, -40]);

  useEffect(() => {
    return progress.on('change', (v) => {
      const next = Math.min(hotspots.length - 1, Math.floor(v * hotspots.length));
      setActive((prev) => (prev === next ? prev : next));
    });
  }, [progress]);

  const current = hotspots[active];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-charcoal py-24 sm:py-32"
      aria-labelledby="map-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 70% 50%, rgba(45,74,62,0.7) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="container-narrow relative grid items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <ScrollReveal>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-gold">
            Island map
          </p>
          <h2
            id="map-heading"
            className="font-serif text-4xl font-semibold text-ivory sm:text-5xl lg:text-6xl"
          >
            Trace the journey
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ivory/75 sm:text-lg">
            Scroll to illuminate regions, coasts, heritage cities, and wild parks — then open the
            chapter that calls you.
          </p>

          <motion.div
            key={current.id}
            className="mt-10 rounded-2xl border border-ivory/15 bg-ivory/5 p-6 backdrop-blur-sm"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-gold">{current.kind}</p>
            <h3 className="mt-2 font-serif text-2xl text-ivory">{current.label}</h3>
            <Link
              to={current.href}
              className="mt-4 inline-flex text-sm font-medium text-gold hover:underline"
            >
              Explore this region →
            </Link>
          </motion.div>
        </ScrollReveal>

        <motion.div
          className="relative mx-auto w-full max-w-md"
          style={reduce ? undefined : { y: floatY }}
        >
          <svg viewBox="0 0 200 320" className="h-auto w-full drop-shadow-2xl" role="img" aria-label="Stylized map of Sri Lanka">
            <defs>
              <linearGradient id="islandFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3D6B56" />
                <stop offset="100%" stopColor="#1B2F27" />
              </linearGradient>
            </defs>
            {/* Simplified Sri Lanka silhouette */}
            <path
              d="M95 18c18 4 34 18 40 38 8 26 6 48 2 72-3 18 4 34 14 48 10 14 16 32 10 50-6 20-24 34-44 42-16 6-34 10-48 4-18-8-28-26-30-46-2-18 2-34-2-50-5-18-14-34-12-52 3-24 18-42 40-50 12-4 22-8 30-6z"
              fill="url(#islandFill)"
              stroke="rgba(196,162,101,0.45)"
              strokeWidth="1.5"
            />
            {hotspots.map((spot, i) => {
              const lit = i <= active;
              return (
                <g key={spot.id}>
                  <motion.circle
                    cx={spot.x * 2}
                    cy={spot.y * 3.05}
                    r={lit ? 5.5 : 3.5}
                    fill={lit ? '#C4A265' : 'rgba(247,243,237,0.35)'}
                    animate={
                      i === active && !reduce
                        ? { scale: [1, 1.35, 1], opacity: [0.85, 1, 0.85] }
                        : undefined
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ transformOrigin: `${spot.x * 2}px ${spot.y * 3.05}px` }}
                  />
                  {i === active ? (
                    <circle
                      cx={spot.x * 2}
                      cy={spot.y * 3.05}
                      r={12}
                      fill="none"
                      stroke="#C4A265"
                      strokeOpacity="0.45"
                    />
                  ) : null}
                </g>
              );
            })}
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
