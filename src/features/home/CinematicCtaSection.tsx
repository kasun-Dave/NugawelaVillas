import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { images } from '@/config/images';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/motion/ScrollMotion';

export function CinematicCtaSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-32 sm:py-40" aria-labelledby="cta-cinematic">
      <motion.img
        src={images.sriLanka.galle}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        initial={reduce ? false : { scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 bg-charcoal/70" />
      <div className="container-narrow relative z-10 px-4 text-center sm:px-6">
        <ScrollReveal>
          <h2
            id="cta-cinematic"
            className="mx-auto max-w-3xl font-serif text-4xl font-semibold text-ivory sm:text-5xl lg:text-6xl"
          >
            Your next horizon is waiting
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ivory/80">
            Open a region, follow a trail, or search the island — the story continues with you.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/destinations">Explore destinations</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-ivory/40 text-ivory hover:bg-ivory/10 hover:text-ivory"
              asChild
            >
              <Link to="/search">Search Sri Lanka</Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
