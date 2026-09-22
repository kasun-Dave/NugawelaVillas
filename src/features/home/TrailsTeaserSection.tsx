import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Footprints, Mountain, Shield, ArrowRight } from 'lucide-react';
import { images, imageGradients } from '@/config/images';
import { Button } from '@/components/ui/Button';

export function TrailsTeaserSection() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="trails-heading">
      <div className="absolute inset-0" style={{ background: imageGradients.forest }} />
      <img
        src={images.adventure.trail}
        alt="Mountain trail through Sri Lankan highland mist"
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
                <Footprints className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-[0.2em]">
                  Nature & adventure
                </span>
              </div>
              <h2 id="trails-heading" className="heading-section mb-6 text-ivory">
                Trails through tea country & beyond
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-ivory/85">
                From short viewpoint walks to longer ridge routes — find distance, difficulty,
                season tips, and safety notes for island hiking.
              </p>

              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-start gap-3 text-ivory/80">
                  <Mountain className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-ivory">Scenic routes</p>
                    <p className="text-sm">Highlands, coasts & forest paths</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-ivory/80">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-ivory">Practical guidance</p>
                    <p className="text-sm">Season, elevation & safety notes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-ivory/80">
                  <Footprints className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-ivory">Linked places</p>
                    <p className="text-sm">Nearby attractions & regions</p>
                  </div>
                </div>
              </div>

              <Button variant="secondary" size="lg" asChild>
                <Link to="/trails">
                  Browse trails
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
