import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { images } from '@/config/images';
import { ScrollReveal, ParallaxCard } from '@/components/motion/ScrollMotion';

const stories = [
  {
    eyebrow: 'Hidden gems',
    title: 'Quiet corners beyond the guidebook',
    body: 'City-scoped trails, village viewpoints, and lesser-known shores waiting just off the main road.',
    href: '/attractions',
    image: images.sriLanka.tea,
    reverse: false,
  },
  {
    eyebrow: 'Seasonal destinations',
    title: 'Follow the light, not the calendar alone',
    body: 'West and south coasts in one season, east coast surf and swimming in another — timing is the trip.',
    href: '/guides',
    image: images.sriLanka.mirissaCoast,
    reverse: true,
  },
  {
    eyebrow: 'Scenic routes',
    title: 'Trains, ridges, and coastal highways',
    body: 'The highland railway, cliff roads above Mirissa, and jeep tracks into scrub forest at dawn.',
    href: '/trails',
    image: images.sriLanka.train,
    reverse: false,
  },
];

export function InspirationEditorialSection() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-ivory py-24 sm:py-32" aria-labelledby="inspiration-heading">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-forest">
            Travel inspiration
          </p>
          <h2
            id="inspiration-heading"
            className="max-w-3xl font-serif text-4xl font-semibold text-charcoal sm:text-5xl lg:text-6xl"
          >
            Stories that shape the itinerary
          </h2>
        </ScrollReveal>

        <div className="mt-16 space-y-20 sm:space-y-28">
          {stories.map((story, i) => (
            <ScrollReveal key={story.title} delay={0.05}>
              <article
                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                  story.reverse ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <ParallaxCard distance={40} speed={1}>
                  <Link to={story.href} className="group relative block overflow-hidden rounded-[2rem]">
                    <motion.img
                      src={story.image}
                      alt={story.title}
                      className="aspect-[4/3] w-full object-cover"
                      loading="lazy"
                      whileHover={reduce ? undefined : { scale: 1.05 }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-charcoal/10 transition group-hover:bg-transparent" />
                  </Link>
                </ParallaxCard>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold">
                    {String(i + 1).padStart(2, '0')} · {story.eyebrow}
                  </p>
                  <h3 className="mt-4 font-serif text-3xl font-semibold leading-tight text-charcoal sm:text-4xl lg:text-5xl">
                    {story.title}
                  </h3>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-charcoal-600 sm:text-lg">
                    {story.body}
                  </p>
                  <Link
                    to={story.href}
                    className="mt-7 inline-flex text-sm font-medium text-forest underline-offset-4 hover:underline"
                  >
                    Continue reading
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
