import { Link } from 'react-router-dom';
import { MapPin, Mail, Mountain } from 'lucide-react';
import { WaveDivider } from '@/components/ui/shared';

const footerLinks = {
  explore: [
    { label: 'Destinations', href: '/destinations' },
    { label: 'Attractions', href: '/attractions' },
    { label: 'Activities', href: '/activities' },
    { label: 'Trails', href: '/trails' },
  ],
  discover: [
    { label: 'National Parks', href: '/national-parks' },
    { label: 'Beaches', href: '/beaches' },
    { label: 'Wildlife', href: '/wildlife' },
    { label: 'Heritage', href: '/heritage' },
  ],
  plan: [
    { label: 'Travel Guides', href: '/guides' },
    { label: 'Travel Updates', href: '/updates' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-white" id="contact">
      <WaveDivider color="#FFFFFF" flip />
      <div
        className="absolute left-0 top-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-forest/5"
        aria-hidden="true"
      />

      <div className="container-narrow section-padding relative">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="mb-6 flex items-center gap-2">
              <Mountain className="h-8 w-8 text-forest" />
              <div>
                <span className="font-serif text-xl font-semibold text-charcoal">Lanka Horizons</span>
                <span className="block text-xs uppercase tracking-widest text-charcoal-400">
                  Travel Guide
                </span>
              </div>
            </div>
            <p className="text-body mb-6">
              A premium guide to Sri Lanka’s landscapes, culture, wildlife, and adventures — from
              ancient cities to misty highlands and wild coasts.
            </p>
            <div className="space-y-3 text-sm text-charcoal-600">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                <address className="not-italic">
                  Exploring all nine provinces
                  <br />
                  Sri Lanka
                </address>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-forest" />
                <a
                  href="mailto:hello@lankahorizons.com"
                  className="transition-colors hover:text-forest"
                >
                  hello@lankahorizons.com
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h3 className="mb-4 font-serif text-sm font-semibold uppercase tracking-wider text-charcoal">
                Explore
              </h3>
              <ul className="space-y-2">
                {footerLinks.explore.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-charcoal-600 transition-colors hover:text-forest"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-serif text-sm font-semibold uppercase tracking-wider text-charcoal">
                Discover
              </h3>
              <ul className="space-y-2">
                {footerLinks.discover.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-charcoal-600 transition-colors hover:text-forest"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-serif text-sm font-semibold uppercase tracking-wider text-charcoal">
                Plan
              </h3>
              <ul className="space-y-2">
                {footerLinks.plan.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-charcoal-600 transition-colors hover:text-forest"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-mist-200 pt-8 text-sm text-charcoal-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Lanka Horizons. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              className="transition-colors hover:text-forest"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com"
              className="transition-colors hover:text-forest"
              aria-label="Facebook"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
