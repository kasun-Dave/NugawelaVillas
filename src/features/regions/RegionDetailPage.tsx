import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Camera, MapPin, Utensils } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ImageWithFallback } from '@/components/ui/shared';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function RegionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['travel', 'region', slug],
    queryFn: () => repositories.travel.getRegionBySlug(slug!),
    enabled: !!slug,
  });
  const region = data?.data;
  useDocumentTitle(region?.name);

  const { data: guidesData } = useQuery({
    queryKey: ['travel', 'guides'],
    queryFn: () => repositories.travel.getGuides(),
  });
  const relatedGuides = (guidesData?.data ?? [])
    .filter((g) => region && g.relatedRegionIds.includes(region.id))
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="section-padding container-narrow space-y-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    );
  }

  if (!region) {
    return (
      <div className="section-padding container-narrow py-16 text-center">
        <h1 className="heading-section mb-4">Destination Not Found</h1>
        <Button asChild>
          <Link to="/destinations">All Destinations</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="relative h-64 sm:h-80">
        <ImageWithFallback src={region.images[0]} alt={region.name} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
        <div className="container-narrow absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">Region</p>
          <h1 className="font-serif text-3xl font-semibold text-ivory sm:text-4xl">{region.name}</h1>
        </div>
      </div>

      <div className="section-padding container-narrow space-y-10">
        <p className="text-body max-w-3xl leading-relaxed">{region.overview}</p>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-mist-200 bg-white p-6">
            <h2 className="font-serif text-lg font-semibold">Best time to visit</h2>
            <p className="mt-2 text-sm text-charcoal-600">{region.bestTimeToVisit}</p>
          </section>
          <section className="rounded-2xl border border-mist-200 bg-white p-6">
            <h2 className="font-serif text-lg font-semibold">Highlights</h2>
            <ul className="mt-2 space-y-1 text-sm text-charcoal-600">
              {region.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-terracotta" /> {h}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section>
          <h2 className="heading-section text-2xl">Things to do</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {region.thingsToDo.map((item) => (
              <li key={item} className="rounded-xl border border-mist-200 bg-white px-4 py-3 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section>
            <h3 className="font-serif text-lg font-semibold">Nature</h3>
            <p className="mt-2 text-sm text-charcoal-600">{region.nature}</p>
          </section>
          <section>
            <h3 className="flex items-center gap-2 font-serif text-lg font-semibold">
              <Utensils className="h-4 w-4 text-forest" /> Food
            </h3>
            <p className="mt-2 text-sm text-charcoal-600">{region.food}</p>
          </section>
          <section>
            <h3 className="font-serif text-lg font-semibold">Culture</h3>
            <p className="mt-2 text-sm text-charcoal-600">{region.culture}</p>
          </section>
        </div>

        <section>
          <h2 className="mb-3 flex items-center gap-2 font-serif text-xl font-semibold">
            <Camera className="h-5 w-5 text-forest" /> Photography spots
          </h2>
          <ul className="flex flex-wrap gap-2">
            {region.photographySpots.map((spot) => (
              <li
                key={spot}
                className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-charcoal-600"
              >
                {spot}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="heading-section text-2xl">Suggested itineraries</h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {region.suggestedItineraries.map((itin) => (
              <li key={itin.title} className="rounded-2xl border border-mist-200 bg-white p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-forest">{itin.days}</p>
                <h3 className="mt-1 font-serif text-lg font-semibold">{itin.title}</h3>
                <p className="mt-2 text-sm text-charcoal-600">{itin.summary}</p>
              </li>
            ))}
          </ul>
        </section>

        {relatedGuides.length > 0 ? (
          <section>
            <h2 className="heading-section text-2xl">Related guides</h2>
            <ul className="mt-4 space-y-2">
              {relatedGuides.map((g) => (
                <li key={g.id}>
                  <Link
                    to={`/guides/${g.slug}`}
                    className="text-sm font-medium text-forest hover:underline"
                  >
                    {g.title}
                  </Link>
                  <p className="text-xs text-charcoal-500">{g.summary}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/attractions">
              Browse attractions <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/activities">Find activities</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/guides">Travel guides</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
