import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Shield, ArrowRight } from 'lucide-react';
import { images, imageGradients } from '@/config/images';
import { Button } from '@/components/ui/Button';

export function AdventureTeaserSection() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="adventure-heading">
      <div className="absolute inset-0" style={{ background: imageGradients.forest }} />
      <img
        src={images.adventure.trail}
        alt="Misty mountain trail at twilight"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-forest/80" />

      <div className="section-padding relative">
        <div className="container-narrow">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 flex items-center gap-2 text-gold">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-[0.2em]">
                  Adventure Experience
                </span>
              </div>
              <h2 id="adventure-heading" className="heading-section mb-6 text-ivory">
                The Hidden Trail of Nugawela
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-ivory/85">
                Receive a welcome card at check-in with your unique adventure code. Enter it here to
                begin a story-driven scavenger hunt across safe, verified locations — from resort
                gardens to partner story-keeper stations in the valley.
              </p>

              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-start gap-3 text-ivory/80">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-ivory">12 Story Stages</p>
                    <p className="text-sm">Across 4 chapters of mystery</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-ivory/80">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-ivory">Safety First</p>
                    <p className="text-sm">Verified locations & daylight guidance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-ivory/80">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-ivory">Artifacts & Badges</p>
                    <p className="text-sm">Collect rewards as you progress</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/adventure">
                    Discover the Trail
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-ivory/40 text-ivory hover:bg-ivory/10 hover:text-ivory"
                  asChild
                >
                  <Link to="/adventure/how-it-works">How It Works</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
