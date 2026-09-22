import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const lines = [
  'From turquoise shores',
  'to misted tea country,',
  'from ancient stone',
  'to wild grasslands —',
  'one island. Many horizons.',
];

export function JourneyIntroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.4]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-charcoal py-28 sm:py-36"
      aria-label="Journey introduction"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(45,74,62,0.8) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <motion.div
        className="container-narrow relative px-4 text-center sm:px-6"
        style={reduce ? undefined : { y, opacity }}
      >
        <p className="mb-8 text-xs font-medium uppercase tracking-[0.4em] text-gold">
          The journey
        </p>
        <div className="space-y-2 sm:space-y-3">
          {lines.map((line, i) => (
            <motion.p
              key={line}
              className="font-serif text-3xl font-medium text-ivory sm:text-5xl lg:text-6xl"
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
