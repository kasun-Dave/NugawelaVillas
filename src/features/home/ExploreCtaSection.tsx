import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ExploreCtaSection() {
  return (
    <section className="section-padding bg-charcoal" aria-labelledby="explore-cta-heading">
      <div className="container-narrow text-center">
        <Compass className="mx-auto h-8 w-8 text-gold" />
        <h2 id="explore-cta-heading" className="heading-section mt-4 text-ivory">
          Ready to explore Sri Lanka?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ivory/80">
          Start with a region, dive into attractions, or search the island for the places that match
          your trip.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button variant="secondary" size="lg" asChild>
            <Link to="/destinations">
              Browse destinations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-ivory/40 text-ivory hover:bg-ivory/10 hover:text-ivory"
            asChild
          >
            <Link to="/search">Search the island</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}