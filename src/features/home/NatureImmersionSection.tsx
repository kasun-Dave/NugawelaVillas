import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { images } from '@/config/images';
import { ScrollReveal, ParallaxCard } from '@/components/motion/ScrollMotion';

const landscapes = [
  {
    title: 'Mountains',
    body: 'Cloud forests, tea ridges, and world-ending cliffs in the cool highlands.',
    href: '/trails',
    image: images.sriLanka.ella,
    span: 'md:col-span-2 md:row-span-2',
    height: 'min-h-[320px] md:min-h-[520px]',
  },
  {
    title: 'Highlands & bridges',
    body: 'Nine Arch Bridge and misted tea valleys around Ella.',
    href: '/attractions',
    image: images.sriLanka.nineArch,
    span: '',
    height: 'min-h-[240px]',
  },
  {
    title: 'Beaches',
    body: 'Mirissa, Unawatuna, and palm shores of the south coast.',
    href: '/beaches',
    image: images.sriLanka.mirissa,
    span: '',
    height: 'min-h-[240px]',
  },
  {
    title: 'Tea country',
    body: 'Emerald plantations rolling through Nuwara Eliya.',
    href: '/national-parks',
    image: images.sriLanka.tea,
    span: 'md:col-span-1',
    height: 'min-h-[260px]',
  },
  {
    title: 'Wildlife',
    body: 'Elephants at Udawalawe and wild parks at dawn.',
    href: '/wildlife',
    image: images.sriLanka.wildlife,
    span: 'md:col-span-2',
    height: 'min-h-[280px]',
  },
];

export function NatureImmersionSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative bg-ivory py-24 sm:py-32" aria-labelledby="nature-heading">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-forest">
            Nature & wildlife
          </p>
          <h2
            id="nature-heading"
            className="max-w-3xl font-serif text-4xl font-semibold leading-tight text-charcoal sm:text-5xl lg:text-6xl"
          >
            Immersed in the living island
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-charcoal-600">
            Layered landscapes that shift as you scroll — mountains, water, forest, and wild
            parks in one continuous frame.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {landscapes.map((item, i) => (
            <ParallaxCard
              key={item.title}
              className={`${item.span}`}
              distance={28 + (i % 3) * 16}
              speed={0.85 + (i % 3) * 0.1}
            >
              <ScrollReveal delay={i * 0.05} y={40}>
                <Link
                  to={item.href}
                  className={`group relative block overflow-hidden rounded-[1.75rem] ${item.height}`}
                >
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    whileHover={reduce ? undefined : { scale: 1.06 }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent transition-opacity duration-500 group-hover:from-charcoal/90" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <h3 className="font-serif text-2xl font-semibold text-ivory sm:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-ivory/80 sm:text-base">{item.body}</p>
                  </div>
                </Link>
              </ScrollReveal>
            </ParallaxCard>
          ))}
        </div>
      </div>
    </section>
  );
}
