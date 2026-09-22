import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Clock, Shield, Backpack, AlertTriangle, BookOpen, Star } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import {
  getDestinationReviews,
  getDestinationReviewSummary,
} from '@/services/mock-data/destinations';
import { TerritoryMap } from '@/components/maps/TerritoryMap';
import { ImageWithFallback } from '@/components/ui/shared';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: destData, isLoading } = useQuery({
    queryKey: ['destination', slug],
    queryFn: () => repositories.destinations.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: allDestData } = useQuery({
    queryKey: ['destinations'],
    queryFn: () => repositories.destinations.getAll(),
  });

  const { data: guidesData } = useQuery({
    queryKey: ['travel', 'guides', 'featured'],
    queryFn: () => repositories.travel.getFeaturedGuides(),
  });

  const dest = destData?.data;
  const allDestinations = allDestData?.data ?? [];
  const nearby = allDestinations
    .filter((d) => d.id !== dest?.id && d.cityId === dest?.cityId)
    .slice(0, 4);
  const relatedGuides = (guidesData?.data ?? []).slice(0, 2);
  useDocumentTitle(dest?.name);

  if (isLoading) {
    return (
      <div className="section-padding container-narrow space-y-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    );
  }

  if (!dest) {
    return (
      <div className="section-padding container-narrow py-16 text-center">
        <h1 className="heading-section mb-4">Destination Not Found</h1>
        <Button asChild>
          <Link to="/attractions">All Attractions</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="relative h-64 sm:h-80">
        <ImageWithFallback src={dest.images[0]} alt={dest.name} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
        <div className="container-narrow absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <span className="mb-2 inline-block rounded-full bg-ivory/20 px-2 py-0.5 text-xs capitalize text-ivory">
            {dest.placeKind === 'famous' ? 'Famous' : 'Hidden gem'} · {dest.cityName} ·{' '}
            {dest.difficulty}
          </span>
          <h1 className="font-serif text-3xl font-semibold text-ivory sm:text-4xl">{dest.name}</h1>
        </div>
      </div>

      <div className="section-padding container-narrow">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section>
              <p className="text-body leading-relaxed">{dest.description}</p>
            </section>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <InfoCard
                icon={<MapPin className="h-4 w-4" />}
                label={`From ${dest.cityName}`}
                value={`${dest.distanceKm} km`}
              />
              <InfoCard
                icon={<Clock className="h-4 w-4" />}
                label="Travel time"
                value={`${dest.travelTimeMinutes} min`}
              />
              <InfoCard
                icon={<Clock className="h-4 w-4" />}
                label="Visit duration"
                value={dest.suggestedVisitDuration}
              />
              <InfoCard
                icon={<Shield className="h-4 w-4" />}
                label="Difficulty"
                value={dest.difficulty}
              />
            </div>

            <section>
              <h2 className="mb-3 flex items-center gap-2 font-serif text-xl font-semibold">
                <BookOpen className="h-5 w-5 text-forest" />
                Cultural Context
              </h2>
              <p className="text-body">{dest.culturalContext}</p>
              {dest.isFictionalStory ? (
                <p className="mt-2 text-xs font-medium text-terracotta">
                  Note: Some adventure story elements at this location are fictional.
                </p>
              ) : null}
            </section>

            <section>
              <h2 className="mb-3 flex items-center gap-2 font-serif text-xl font-semibold">
                <Backpack className="h-5 w-5 text-forest" />
                What to Bring
              </h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {dest.whatToBring.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-charcoal-600">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-3 flex items-center gap-2 font-serif text-xl font-semibold">
                <AlertTriangle className="h-5 w-5 text-terracotta" />
                Safety Notes
              </h2>
              <ul className="space-y-2">
                {dest.safetyNotes.map((note) => (
                  <li
                    key={note}
                    className="flex items-start gap-2 rounded-xl border border-terracotta/10 bg-terracotta/5 p-3 text-sm text-charcoal-600"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                    {note}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-xl font-semibold">Accessibility</h2>
              <p className="text-body">{dest.accessibility}</p>
            </section>

            <ReviewsSection dest={dest} />
          </div>

          <div className="space-y-6">
            <TerritoryMap destinations={allDestinations} highlightedId={dest.id} className="h-56" />

            <div className="space-y-3 rounded-2xl border border-mist-200 bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-charcoal-500">
                Keep exploring
              </p>
              <Button variant="primary" className="w-full" asChild>
                <Link to="/destinations">Browse regions</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/activities">Find activities</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/guides">Travel guides</Link>
              </Button>
            </div>

            {nearby.length > 0 ? (
              <div className="rounded-2xl border border-mist-200 bg-white p-6">
                <h2 className="font-serif text-lg font-semibold">Nearby attractions</h2>
                <ul className="mt-3 space-y-2">
                  {nearby.map((n) => (
                    <li key={n.id}>
                      <Link
                        to={`/attractions/${n.slug}`}
                        className="text-sm font-medium text-forest hover:underline"
                      >
                        {n.name}
                      </Link>
                      <p className="text-xs text-charcoal-500">{n.shortDescription}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {relatedGuides.length > 0 ? (
              <div className="rounded-2xl border border-mist-200 bg-white p-6">
                <h2 className="font-serif text-lg font-semibold">Related guides</h2>
                <ul className="mt-3 space-y-2">
                  {relatedGuides.map((g) => (
                    <li key={g.id}>
                      <Link
                        to={`/guides/${g.slug}`}
                        className="text-sm font-medium text-forest hover:underline"
                      >
                        {g.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewsSection({
  dest,
}: {
  dest: Parameters<typeof getDestinationReviews>[0] & { name: string };
}) {
  const reviews = getDestinationReviews(dest);
  const summary = getDestinationReviewSummary(dest);
  if (!reviews.length) return null;

  return (
    <section>
      <h2 className="mb-1 flex items-center gap-2 font-serif text-xl font-semibold">
        <Star className="h-5 w-5 text-gold" />
        Traveller Reviews
      </h2>
      <p className="mb-4 text-sm text-charcoal-400">
        {summary.averageRating.toFixed(1)} average · {summary.reviewCount} review
        {summary.reviewCount === 1 ? '' : 's'}
      </p>
      <ul className="space-y-3">
        {reviews.slice(0, 6).map((review) => (
          <li key={review.id} className="rounded-xl border border-mist-200 bg-white p-4">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-charcoal">{review.author}</span>
              <span className="flex items-center gap-1 text-xs text-charcoal-400">
                <StarRating rating={review.rating} />
                {review.visitedOn}
              </span>
            </div>
            <p className="text-sm text-charcoal-600">{review.comment}</p>
          </li>
        ))}
      </ul>
      {reviews.length > 6 ? (
        <p className="mt-2 text-xs text-charcoal-400">Showing 6 of {reviews.length} reviews.</p>
      ) : null}
    </section>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i < rating ? 'fill-gold text-gold' : 'text-mist-300'}`}
        />
      ))}
    </span>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-mist-200 bg-white p-4">
      <div className="mb-1 flex items-center gap-1.5 text-xs text-charcoal-400">
        {icon} {label}
      </div>
      <p className="font-medium capitalize text-charcoal">{value}</p>
    </div>
  );
}
