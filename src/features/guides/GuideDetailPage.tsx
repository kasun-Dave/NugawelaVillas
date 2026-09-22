import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { repositories } from '@/services/repository-registry';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ImageWithFallback } from '@/components/ui/shared';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['travel', 'guide', slug],
    queryFn: () => repositories.travel.getGuideBySlug(slug!),
    enabled: !!slug,
  });
  const guide = data?.data;
  useDocumentTitle(guide?.title);

  const { data: regionsData } = useQuery({
    queryKey: ['travel', 'regions'],
    queryFn: () => repositories.travel.getRegions(),
  });
  const relatedRegions = (regionsData?.data ?? []).filter((r) =>
    guide?.relatedRegionIds?.includes(r.id),
  );

  if (isLoading) {
    return (
      <div className="section-padding container-narrow">
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }
  if (!guide) {
    return (
      <div className="section-padding container-narrow py-16 text-center">
        <h1 className="heading-section mb-4">Guide Not Found</h1>
        <Button asChild>
          <Link to="/guides">All Guides</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="relative h-56 sm:h-72">
        <ImageWithFallback src={guide.images[0]} alt={guide.title} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
        <div className="container-narrow absolute bottom-0 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-widest text-gold">
            {guide.topic.replace('_', ' ')} · {guide.readingMinutes} min
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-ivory sm:text-4xl">
            {guide.title}
          </h1>
        </div>
      </div>
      <div className="section-padding container-narrow max-w-3xl space-y-8">
        <p className="text-body text-lg">{guide.summary}</p>
        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-serif text-xl font-semibold">{section.heading}</h2>
            <p className="mt-2 text-charcoal-600 leading-relaxed">{section.body}</p>
          </section>
        ))}
        {relatedRegions.length > 0 ? (
          <section>
            <h2 className="font-serif text-xl font-semibold">Related destinations</h2>
            <ul className="mt-3 flex flex-wrap gap-3">
              {relatedRegions.map((r) => (
                <li key={r.id}>
                  <Link
                    to={`/destinations/${r.slug}`}
                    className="rounded-full border border-mist-200 bg-white px-3 py-1.5 text-sm font-medium text-forest hover:border-forest/40"
                  >
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <div className="flex flex-wrap gap-3 pt-4">
          <Button asChild>
            <Link to="/destinations">Explore destinations</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/updates">Travel updates</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
