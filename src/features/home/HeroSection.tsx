import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { images, imageGradients } from '@/config/images';
import { Button } from '@/components/ui/Button';

const slides = images.hero.slides;
const AUTO_MS = 6000;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPaused, setAutoPaused] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    restDelta: 0.001,
  });

  const contentY = useTransform(smoothProgress, [0, 0.6], [0, -80]);
  const contentOpacity = useTransform(smoothProgress, [0, 0.35, 0.7], [1, 1, 0]);
  const imageScale = useTransform(smoothProgress, [0, 1], [1, 1.18]);
  const mistY = useTransform(smoothProgress, [0, 1], [0, 120]);
  const rayOpacity = useTransform(smoothProgress, [0, 0.4], [0.55, 0.15]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    return smoothProgress.on('change', (v) => {
      const next = Math.min(slides.length - 1, Math.floor(v * slides.length * 0.9));
      setActiveIndex((prev) => (prev === next ? prev : next));
      if (v > 0.05) setAutoPaused(true);
      if (v < 0.02) setAutoPaused(false);
    });
  }, [smoothProgress, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || autoPaused) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [autoPaused, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[240vh]"
      aria-label="Explore Sri Lanka"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: imageGradients.hero }}
          aria-hidden="true"
        />

        <motion.div
          className="absolute inset-0"
          style={{ scale: prefersReducedMotion ? 1 : imageScale }}
        >
          <AnimatePresence mode="sync" initial={false}>
            <motion.img
              key={slides[activeIndex].src}
              src={slides[activeIndex].src}
              alt={slides[activeIndex].alt}
              className="absolute inset-0 h-full w-full object-cover"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              fetchPriority={activeIndex === 0 ? 'high' : 'auto'}
            />
          </AnimatePresence>
        </motion.div>

        {/* Atmospheric layers */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: prefersReducedMotion ? 0.35 : rayOpacity }}
          aria-hidden="true"
        >
          <div className="absolute -left-1/4 top-0 h-[70%] w-[70%] rotate-12 bg-[radial-gradient(ellipse_at_center,rgba(196,162,101,0.28)_0%,transparent_65%)]" />
          <div className="absolute right-0 top-1/4 h-[50%] w-[45%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12)_0%,transparent_60%)]" />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent"
          style={prefersReducedMotion ? undefined : { y: mistY }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-transparent to-charcoal/80" />

        {!prefersReducedMotion ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-ivory/10 blur-3xl"
                style={{
                  width: `${28 + i * 18}%`,
                  height: `${12 + i * 6}%`,
                  left: `${10 + i * 22}%`,
                  top: `${18 + i * 12}%`,
                }}
                animate={{ x: [0, 30, -10, 0], opacity: [0.15, 0.35, 0.2, 0.15] }}
                transition={{ duration: 14 + i * 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>
        ) : null}

        <motion.div
          className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"
          style={prefersReducedMotion ? undefined : { y: contentY, opacity: contentOpacity }}
        >
          <motion.p
            className="mb-6 font-serif text-sm tracking-[0.4em] text-gold sm:text-base"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            Lanka Horizons
          </motion.p>

          <h1 className="text-balance font-serif text-5xl font-semibold uppercase leading-[0.95] tracking-[0.04em] text-ivory sm:text-7xl lg:text-8xl">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={prefersReducedMotion ? false : { y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                Explore
              </motion.span>
            </span>
            <span className="mt-1 block overflow-hidden">
              <motion.span
                className="block text-gold"
                initial={prefersReducedMotion ? false : { y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                Sri Lanka
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mx-auto mt-8 max-w-xl text-lg font-light leading-relaxed text-ivory/85 sm:text-xl"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            A cinematic journey across coasts, highlands, wildlife, and living heritage —
            scroll to travel the island.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            <Button variant="primary" size="lg" asChild>
              <Link to="/destinations">
                Begin the journey
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <p className="mt-8 text-xs uppercase tracking-[0.35em] text-ivory/55">
            {slides[activeIndex].label}
          </p>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-ivory/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          aria-hidden="true"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.4em]">
            Scroll to discover
          </span>
          <motion.span
            className="block h-10 w-px origin-top bg-gradient-to-b from-gold to-transparent"
            animate={
              prefersReducedMotion
                ? undefined
                : { scaleY: [0.4, 1, 0.4], opacity: [0.35, 1, 0.35] }
            }
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
