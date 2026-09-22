import { Link } from 'react-router-dom';
import { Sun, CloudRain, Leaf } from 'lucide-react';
import { ParallaxCard, ScrollReveal } from '@/components/motion/ScrollMotion';

const seasons = [
  {
    icon: Sun,
    title: 'Dry season focus',
    body: 'Wildlife parks and cultural triangle sites shine in the main dry months.',
    href: '/guides',
  },
  {
    icon: CloudRain,
    title: 'East vs west coasts',
    body: 'Monsoons flip beach seasons — plan surf, swimming, and road travel accordingly.',
    href: '/beaches',
  },
  {
    icon: Leaf,
    title: 'Hill country cool',
    body: 'Tea trails and misty viewpoints reward cooler months and early starts.',
    href: '/trails',
  },
];

export function SeasonalStripSection() {
  return (
    <section className="section-padding bg-ivory" aria-labelledby="seasonal-heading">
      <div className="container-narrow">
        <ScrollReveal>
          <h2 id="seasonal-heading" className="heading-section text-center">
            Seasonal inspiration
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-charcoal-600">
            Timing shapes the trip — coasts, parks, and highlands each have their window.
          </p>
        </ScrollReveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {seasons.map(({ icon: Icon, title, body, href }, i) => (
            <ParallaxCard key={title} distance={32 + i * 14} speed={0.9 + i * 0.1}>
              <ScrollReveal delay={i * 0.08}>
                <Link
                  to={href}
                  className="block rounded-2xl border border-mist-200 bg-white p-6 transition hover:border-forest/30 hover:shadow-sm"
                >
                  <Icon className="h-6 w-6 text-forest" />
                  <h3 className="mt-4 font-serif text-lg font-semibold text-charcoal">{title}</h3>
                  <p className="mt-2 text-sm text-charcoal-600">{body}</p>
                </Link>
              </ScrollReveal>
            </ParallaxCard>
          ))}
        </div>
      </div>
    </section>
  );
}
