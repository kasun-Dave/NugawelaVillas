import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Mountain, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';

const primaryLinks = [
  { href: '/destinations', label: 'Destinations' },
  { href: '/attractions', label: 'Attractions' },
  { href: '/activities', label: 'Activities' },
  { href: '/trails', label: 'Trails' },
  { href: '/guides', label: 'Guides' },
];

const exploreLinks = [
  { href: '/national-parks', label: 'National Parks' },
  { href: '/beaches', label: 'Beaches' },
  { href: '/wildlife', label: 'Wildlife' },
  { href: '/heritage', label: 'Heritage' },
  { href: '/updates', label: 'Travel Updates' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const lightNav = isHome && !scrolled && !mobileOpen;

  const exploreActive = exploreLinks.some((l) => location.pathname.startsWith(l.href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setExploreOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-40 transition-all duration-500 ease-out',
        lightNav
          ? 'bg-transparent'
          : isHome
            ? 'border-b border-white/10 bg-charcoal/55 shadow-sm backdrop-blur-xl'
            : 'border-b border-mist-200 bg-ivory/90 shadow-sm backdrop-blur-md',
      )}
    >
      <div className="container-narrow flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2" aria-label="Lanka Horizons — Home">
          <Mountain
            className={cn(
              'h-7 w-7 transition-colors duration-500',
              lightNav || (isHome && scrolled) ? 'text-gold' : 'text-forest',
            )}
          />
          <div className="flex flex-col">
            <span
              className={cn(
                'font-serif text-lg font-semibold leading-tight transition-colors duration-500',
                lightNav || (isHome && scrolled) ? 'text-ivory' : 'text-charcoal',
              )}
            >
              Lanka Horizons
            </span>
            <span
              className={cn(
                'text-xs uppercase tracking-widest transition-colors duration-500',
                lightNav || (isHome && scrolled) ? 'text-ivory/70' : 'text-charcoal-400',
              )}
            >
              Travel Guide
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'rounded-full px-3 py-2 text-sm font-medium transition-colors duration-300',
                lightNav || (isHome && scrolled)
                  ? 'text-ivory/90 hover:bg-white/10 hover:text-ivory'
                  : 'text-charcoal-600 hover:bg-forest-50 hover:text-forest',
                location.pathname.startsWith(link.href) &&
                  (lightNav || (isHome && scrolled)
                    ? 'bg-white/15 text-ivory'
                    : 'bg-forest-50 text-forest'),
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              className={cn(
                'flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors duration-300',
                lightNav || (isHome && scrolled)
                  ? 'text-ivory/90 hover:bg-white/10 hover:text-ivory'
                  : 'text-charcoal-600 hover:bg-forest-50 hover:text-forest',
                exploreActive &&
                  (lightNav || (isHome && scrolled)
                    ? 'bg-white/15 text-ivory'
                    : 'bg-forest-50 text-forest'),
              )}
              onClick={() => setExploreOpen((o) => !o)}
              aria-expanded={exploreOpen}
            >
              Explore <ChevronDown className="h-4 w-4" />
            </button>
            {exploreOpen ? (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-mist-200 bg-white/95 p-2 shadow-lg backdrop-blur-md">
                {exploreLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'block rounded-xl px-3 py-2 text-sm text-charcoal-600 hover:bg-forest-50 hover:text-forest',
                      location.pathname.startsWith(link.href) && 'bg-forest-50 text-forest',
                    )}
                    onClick={() => setExploreOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/search"
            className={cn(
              'hidden h-10 w-10 items-center justify-center rounded-full transition-colors sm:flex',
              lightNav || (isHome && scrolled)
                ? 'text-ivory/80 hover:bg-white/10 hover:text-ivory'
                : 'text-charcoal-500 hover:bg-mist hover:text-forest',
            )}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Button
            variant={lightNav || (isHome && scrolled) ? 'secondary' : 'primary'}
            size="sm"
            className="hidden sm:inline-flex"
            asChild
          >
            <Link to="/destinations">Explore Sri Lanka</Link>
          </Button>
          <button
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full transition-colors lg:hidden',
              lightNav || (isHome && scrolled)
                ? 'text-ivory hover:bg-white/10'
                : 'text-charcoal hover:bg-mist',
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          className="border-t border-mist-200 bg-ivory px-4 py-4 shadow-lg lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {[...primaryLinks, ...exploreLinks, { href: '/search', label: 'Search' }].map(
              (link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                    location.pathname.startsWith(link.href)
                      ? 'bg-forest-50 text-forest'
                      : 'text-charcoal hover:bg-mist',
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ),
            )}
            <div className="pt-2">
              <Button variant="primary" className="w-full" asChild>
                <Link to="/destinations" onClick={() => setMobileOpen(false)}>
                  Explore Sri Lanka
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
