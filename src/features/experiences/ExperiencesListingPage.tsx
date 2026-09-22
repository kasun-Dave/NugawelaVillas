import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, Users, SlidersHorizontal, X } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { ImageWithFallback } from '@/components/ui/shared';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import type { ExperienceCategory } from '@/types';

const CATEGORIES: ExperienceCategory[] = [
  'nature',
  'culinary',
  'cultural',
  'adventure',
  'wellness',
  'family',
];

export function ExperiencesListingPage() {
  const [category, setCategory] = useState<ExperienceCategory | ''>('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => repositories.experiences.getAll(),
  });

  const experiences = data?.data ?? [];

  const filtered = useMemo(() => {
    return experiences.filter((e) => {
      if (category && e.category !== category) return false;
      if (maxPrice && e.price > parseFloat(maxPrice)) return false;
      return true;
    });
  }, [experiences, category, maxPrice]);

  return (
    <div className="section-padding min-h-screen bg-ivory">
      <div className="container-narrow">
        <div className="mb-8">
          <h1 className="heading-section">Curated Experiences</h1>
          <p className="text-body mt-2 max-w-2xl">
            Guided walks, tea tastings, campfire evenings, and more — designed to connect you with
            the valley.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className={`shrink-0 lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 rounded-2xl border border-mist-200 bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 font-serif font-semibold">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExperienceCategory | '')}
                    className="w-full rounded-xl border border-mist-200 px-3 py-2 text-sm"
                  >
                    <option value="">All categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="capitalize">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Max price</label>
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-xl border border-mist-200 px-3 py-2 text-sm"
                  >
                    <option value="">Any price</option>
                    <option value="40">Up to $40</option>
                    <option value="60">Up to $60</option>
                    <option value="80">Up to $80</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-charcoal-500">
                {filtered.length} experience{filtered.length !== 1 ? 's' : ''}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? (
                  <X className="h-4 w-4" />
                ) : (
                  <SlidersHorizontal className="h-4 w-4" />
                )}
                Filters
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <p className="text-terracotta">Failed to load experiences.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((exp) => (
                  <article
                    key={exp.id}
                    className="group overflow-hidden rounded-2xl border border-mist-200 bg-white transition-shadow hover:shadow-md"
                  >
                    <Link to={`/experiences/${exp.slug}`}>
                      <ImageWithFallback
                        src={exp.images[0]}
                        alt={exp.name}
                        className="h-48 w-full"
                      />
                      <div className="p-5">
                        <span className="text-xs font-medium uppercase capitalize tracking-wider text-gold">
                          {exp.category}
                        </span>
                        <h2 className="mt-1 font-serif text-lg font-semibold transition-colors group-hover:text-forest">
                          {exp.name}
                        </h2>
                        <p className="mt-1 line-clamp-2 text-sm text-charcoal-600">
                          {exp.shortDescription}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="flex items-center gap-3 text-charcoal-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" /> {exp.durationMinutes} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" /> Max {exp.maxParticipants}
                            </span>
                          </span>
                          <span className="font-semibold text-forest">${exp.price}</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
