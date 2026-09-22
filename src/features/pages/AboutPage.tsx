import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function AboutPage() {
  return (
    <div className="section-padding min-h-screen bg-ivory">
      <div className="container-narrow max-w-3xl">
        <h1 className="heading-section">About Lanka Horizons</h1>
        <p className="text-body mt-4 leading-relaxed">
          Lanka Horizons is a premium travel guide to Sri Lanka — built to help visitors discover
          destinations, trails, wildlife, heritage, and culture across the island. We focus on
          inspiring, practical content rather than hotel bookings.
        </p>
        <p className="text-body mt-4 leading-relaxed">
          From the Cultural Triangle to the Hill Country, wild parks, and both coasts, our pages
          connect regions, attractions, activities, and guides so you can plan with confidence.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/destinations">Start with destinations</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
