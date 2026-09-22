import { useState, useEffect, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  MapPin,
  Compass,
  Footprints,
  BookOpen,
  Newspaper,
  HelpCircle,
  Globe2,
} from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { Skeleton } from '@/components/ui/Skeleton';
import type { SearchResult } from '@/types';

const TYPE_ICONS: Record<SearchResult['type'], ReactNode> = {
  attraction: <MapPin className="h-4 w-4" />,
  region: <Globe2 className="h-4 w-4" />,
  activity: <Compass className="h-4 w-4" />,
  trail: <Footprints className="h-4 w-4" />,
  guide: <BookOpen className="h-4 w-4" />,
  update: <Newspaper className="h-4 w-4" />,
  faq: <HelpCircle className="h-4 w-4" />,
};

const TYPE_LABELS: Record<SearchResult['type'], string> = {
  attraction: 'Attraction',
  region: 'Destination',
  activity: 'Activity',
  trail: 'Trail',
  guide: 'Guide',
  update: 'Update',
  faq: 'FAQ',
};

const FILTERS: Array<SearchResult['type'] | ''> = [
  '',
  'region',
  'attraction',
  'activity',
  'trail',
  'guide',
  'update',
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState<SearchResult['type'] | ''>('');

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    document.title = query
      ? `Search “${query}” — Lanka Horizons`
      : 'Search — Lanka Horizons';
  }, [query]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', query, typeFilter],
    queryFn: () =>
      repositories.search.search(query, {
        type: typeFilter || undefined,
      }),
    enabled: query.length >= 2,
  });

  const results = data?.data ?? [];

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="section-padding min-h-screen bg-ivory">
      <div className="container-narrow max-w-3xl">
        <h1 className="heading-section mb-6">Discover Sri Lanka</h1>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search destinations, attractions, activities, trails, guides..."
            className="w-full rounded-2xl border border-mist-200 bg-white py-3.5 pl-12 pr-4 text-charcoal focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
            aria-label="Search"
          />
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((type) => (
            <button
              key={type || 'all'}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                typeFilter === type
                  ? 'bg-forest text-ivory'
                  : 'border border-mist-200 bg-white text-charcoal-600 hover:bg-mist'
              }`}
            >
              {type === '' ? 'All' : TYPE_LABELS[type]}
            </button>
          ))}
        </div>

        {query.length < 2 ? (
          <p className="py-12 text-center text-charcoal-500">
            Type at least 2 characters to search destinations, attractions, activities, trails, and
            guides.
          </p>
        ) : isLoading || isFetching ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-mist-200 bg-white py-12 text-center">
            <p className="text-charcoal-600">No results for &ldquo;{query}&rdquo;</p>
            <p className="mt-2 text-sm text-charcoal-400">
              Try different keywords or browse by category above.
            </p>
          </div>
        ) : (
          <div className="space-y-3" role="list" aria-label="Search results">
            <p className="mb-4 text-sm text-charcoal-500">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            {results.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                to={result.url}
                className="flex items-start gap-3 rounded-2xl border border-mist-200 bg-white p-4 transition hover:border-forest/30 hover:shadow-sm"
                role="listitem"
              >
                <span className="mt-0.5 rounded-full bg-mist p-2 text-forest">
                  {TYPE_ICONS[result.type]}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-lg font-semibold text-charcoal">{result.title}</h2>
                    <span className="rounded-full bg-mist px-2 py-0.5 text-xs text-charcoal-500">
                      {TYPE_LABELS[result.type]}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-charcoal-600">{result.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
