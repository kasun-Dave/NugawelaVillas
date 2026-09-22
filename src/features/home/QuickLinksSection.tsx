import { Link } from 'react-router-dom';
import { Trees, Waves, Footprints, Landmark, PawPrint } from 'lucide-react';
import { ScrollReveal } from '@/components/motion/ScrollMotion';

const links = [
  { icon: Trees, label: 'National Parks', href: '/national-parks' },
  { icon: Waves, label: 'Beaches', href: '/beaches' },
  { icon: Footprints, label: 'Trails', href: '/trails' },
  { icon: Landmark, label: 'Heritage', href: '/heritage' },
  { icon: PawPrint, label: 'Wildlife', href: '/wildlife' },
];

export function QuickLinksSection() {
  return (
    <section className="section-padding bg-ivory" aria-label="Quick explore">
      <div className="container-narrow">
        <ScrollReveal y={28}>
          <div className="flex flex-wrap justify-center gap-3">
            {links.map(({ icon: Icon, label, href }, i) => (
              <ScrollReveal key={href} delay={i * 0.05} y={20}>
                <Link
                  to={href}
                  className="inline-flex items-center gap-2 rounded-full border border-mist-200 bg-white px-4 py-2 text-sm font-medium text-charcoal-600 transition hover:border-forest/40 hover:text-forest"
                >
                  <Icon className="h-4 w-4 text-forest" />
                  {label}
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
