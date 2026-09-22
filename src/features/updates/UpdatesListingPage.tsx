import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { CardSkeleton } from '@/components/ui/Skeleton';

export function UpdatesListingPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['travel', 'updates'],
    queryFn: () => repositories.travel.getUpdates(),
  });
  const updates = data?.data ?? [];

  return (
    <div className="section-padding min-h-screen bg-ivory">
      <div className="container-narrow">
        <h1 className="heading-section">Travel Updates</h1>
        <p className="text-body mt-2 max-w-2xl">
          Seasonal notes, park news, trail notices, festivals, and conservation reminders.
        </p>
        {isLoading ? (
          <div className="mt-10 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <p className="mt-8 text-terracotta">Unable to load updates.</p>
        ) : (
          <ul className="mt-10 space-y-4">
            {updates.map((upd) => (
              <li key={upd.id}>
                <Link
                  to={`/updates/${upd.slug}`}
                  className="block rounded-2xl border border-mist-200 bg-white p-5 transition hover:border-forest/30"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-forest">
                    <span>{upd.category}</span>
                    <span className="text-charcoal-400">·</span>
                    <time dateTime={upd.publishedAt}>{upd.publishedAt}</time>
                  </div>
                  <h2 className="mt-1 font-serif text-xl font-semibold">{upd.title}</h2>
                  <p className="mt-1 text-sm text-charcoal-600">{upd.summary}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-forest">
                    Read update <ArrowRight className="h-4 w-4" />
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
