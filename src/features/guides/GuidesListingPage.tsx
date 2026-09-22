import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { CardSkeleton } from '@/components/ui/Skeleton';

export function GuidesListingPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['travel', 'guides'],
    queryFn: () => repositories.travel.getGuides(),
  });
  const guides = data?.data ?? [];

  return (
    <div className="section-padding min-h-screen bg-ivory">
      <div className="container-narrow">
        <h1 className="heading-section">Travel Guides</h1>
        <p className="text-body mt-2 max-w-2xl">
          Practical advice for first-timers, food lovers, wildlife travelers, and seasonal planners.
        </p>
        {isLoading ? (
          <div className="mt-10 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <p className="mt-8 text-terracotta">Unable to load guides.</p>
        ) : (
          <ul className="mt-10 space-y-4">
            {guides.map((guide) => (
              <li key={guide.id}>
                <Link
                  to={`/guides/${guide.slug}`}
                  className="flex flex-col gap-3 rounded-2xl border border-mist-200 bg-white p-5 transition hover:border-forest/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-forest">
                      {guide.topic.replace('_', ' ')} · {guide.readingMinutes} min read
                    </p>
                    <h2 className="mt-1 font-serif text-xl font-semibold">{guide.title}</h2>
                    <p className="mt-1 text-sm text-charcoal-600">{guide.summary}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-forest">
                    <BookOpen className="h-4 w-4" /> Read <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
