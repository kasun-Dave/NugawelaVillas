import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import '@/styles/adventure-theme.css';

const subLinks = [
  { href: '/adventure', label: 'Overview', end: true },
  { href: '/adventure/how-it-works', label: 'How It Works' },
  { href: '/adventure/safety', label: 'Safety Guide' },
  { href: '/adventure/faq', label: 'FAQ' },
];

export function AdventurePublicLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/adventure';
  const isPlayRoute =
    location.pathname.startsWith('/adventure/play') ||
    location.pathname.startsWith('/adventure/dashboard') ||
    location.pathname.startsWith('/adventure/stage');

  return (
    <div className="adventure-realm">
      <div className="adventure-realm__inner">
        <div className="container-narrow section-padding pb-0">
          {isLanding ? (
            <div className="adventure-hero-panel mb-6 rounded-2xl p-8 sm:p-10">
              <p className="adventure-subheading mb-2 text-sm font-medium uppercase tracking-[0.2em]">
                Adventure Experience
              </p>
              <h1 className="adventure-heading max-w-2xl font-serif text-4xl font-semibold sm:text-5xl">
                The Hidden Trail of Nugawela
              </h1>
              <p className="adventure-text mt-4 max-w-xl text-lg leading-relaxed">
                A story-driven scavenger hunt across safe, verified locations — from resort gardens
                to valley story-keepers.
              </p>
            </div>
          ) : (
            <h1 className="adventure-heading mb-4 font-serif text-3xl font-semibold sm:text-4xl">
              The Hidden Trail
            </h1>
          )}
        </div>

        <nav
          className="adventure-nav container-narrow mx-auto mb-6 flex flex-wrap gap-2 rounded-xl px-4 py-3 sm:px-6 lg:px-8"
          aria-label="Adventure sections"
        >
          {subLinks.map((link) => {
            const active = link.end
              ? location.pathname === link.href
              : location.pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'adventure-nav-link rounded-full px-4 py-1.5 text-sm font-medium',
                  active && 'adventure-nav-link--active',
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {!isPlayRoute ? (
            <Link
              to="/adventure/play"
              className="adventure-nav-cta ml-auto rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            >
              Enter Adventure Code
            </Link>
          ) : (
            <Link
              to="/adventure/dashboard"
              className="adventure-nav-cta ml-auto rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            >
              Adventure Dashboard
            </Link>
          )}
        </nav>

        <div className="container-narrow section-padding pt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
