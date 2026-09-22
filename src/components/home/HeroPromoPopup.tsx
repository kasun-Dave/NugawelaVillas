import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, X, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'nugawela_hero_promo_dismissed';

export function HeroPromoPopup() {
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== '1';
    } catch {
      return true;
    }
  });

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.aside
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28, delay: 1.2 }}
          className="relative mx-auto mt-10 max-w-lg"
          aria-label="Seasonal promotion"
        >
          <div className="relative overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-forest/95 via-forest to-charcoal/90 p-5 shadow-2xl backdrop-blur-md sm:p-6">
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/20 blur-2xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-ivory/10 blur-xl"
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={dismiss}
              className="absolute right-3 top-3 rounded-full p-1.5 text-ivory/60 transition-colors hover:bg-white/10 hover:text-ivory"
              aria-label="Dismiss promotion"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold"
                aria-hidden="true"
              >
                <Compass className="h-6 w-6" />
              </div>
              <div className="min-w-0 pr-6">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gold">
                  <Sparkles className="h-3.5 w-3.5" />
                  New This Season
                </p>
                <h2 className="mb-2 font-serif text-xl font-semibold text-ivory sm:text-2xl">
                  The Hidden Trail awaits
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-ivory/80">
                  Twelve misty stages across the valley — riddles, artifacts, and a story only
                  guests can unlock. Check in to receive your trail code.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/adventure"
                    className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal transition-transform hover:scale-[1.02] hover:bg-gold-400"
                  >
                    Explore the trail
                  </Link>
                  <Link
                    to="/adventure/play"
                    className="inline-flex items-center justify-center rounded-full border border-ivory/30 px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-white/10"
                  >
                    Enter code
                  </Link>
                </div>
              </div>
            </div>

            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 1.6, ease: 'easeOut' }}
              style={{ originX: 0 }}
              aria-hidden="true"
            />
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
