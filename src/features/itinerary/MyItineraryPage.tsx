import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Sparkles, Trash2, Clock, AlertTriangle, Compass } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { useItineraryStore } from '@/stores/itineraryStore';
import { usePreferencesStore } from '@/stores/preferencesStore';
import { getRecommendations } from '@/utils/recommendations';
import { optimizeItinerary } from '@/utils/itinerary';
import { Button } from '@/components/ui/Button';
import { TerritoryMap } from '@/components/maps/TerritoryMap';

export function MyItineraryPage() {
  const { items, removeItem, clear } = useItineraryStore();
  const preferences = usePreferencesStore((s) => s.preferences);

  const { data: destData } = useQuery({
    queryKey: ['destinations'],
    queryFn: () => repositories.destinations.getAll(),
  });

  const { data: expData } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => repositories.experiences.getAll(),
  });

  const destinations = destData?.data ?? [];
  const experiences = expData?.data ?? [];

  const recommendations = getRecommendations(destinations, experiences, preferences);

  const optimized = optimizeItinerary(items, destinations, experiences);

  const resolveItem = (type: string, itemId: string) => {
    if (type === 'destination') {
      const d = destinations.find((dest) => dest.id === itemId);
      return d
        ? { name: d.name, url: `/destinations/${d.slug}`, type: 'destination' as const }
        : null;
    }
    const e = experiences.find((exp) => exp.id === itemId);
    return e ? { name: e.name, url: `/experiences/${e.slug}`, type: 'experience' as const } : null;
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="flex justify-end">
            {items.length > 0 ? (
              <Button variant="outline" size="sm" onClick={clear}>
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            ) : null}
          </div>
          {items.length === 0 ? (
            <div className="rounded-2xl border border-mist-200 bg-white py-16 text-center">
              <Compass className="mx-auto mb-4 h-12 w-12 text-charcoal-300" />
              <p className="mb-2 text-charcoal-600">Your itinerary is empty.</p>
              <p className="mb-6 text-sm text-charcoal-400">
                Save destinations and experiences as you explore.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link to="/destinations">Browse Destinations</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/experiences">Browse Experiences</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <section>
                <h2 className="mb-4 font-serif text-xl font-semibold">
                  Saved Items ({items.length})
                </h2>
                <div className="space-y-3">
                  {items.map((item) => {
                    const resolved = resolveItem(item.type, item.itemId);
                    if (!resolved) return null;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-2xl border border-mist-200 bg-white p-4"
                      >
                        <div className="flex items-center gap-3">
                          {resolved.type === 'destination' ? (
                            <MapPin className="h-5 w-5 shrink-0 text-forest" />
                          ) : (
                            <Sparkles className="h-5 w-5 shrink-0 text-gold" />
                          )}
                          <div>
                            <Link
                              to={resolved.url}
                              className="font-medium transition-colors hover:text-forest"
                            >
                              {resolved.name}
                            </Link>
                            <p className="text-xs capitalize text-charcoal-400">{resolved.type}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-charcoal-400 hover:text-terracotta"
                          aria-label={`Remove ${resolved.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>

              {optimized.items.length > 0 ? (
                <section>
                  <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-semibold">
                    <Clock className="h-5 w-5 text-forest" />
                    Optimized Day Plan
                  </h2>
                  <p className="mb-4 text-sm text-charcoal-500">
                    Suggested schedule starting at 8:00 AM, ordered by distance from resort. Total:
                    ~{Math.round(optimized.totalDurationMinutes / 60)} hours ·{' '}
                    {optimized.totalDistanceKm.toFixed(1)} km
                  </p>
                  <div className="space-y-3">
                    {optimized.items.map((plan, i) => (
                      <div
                        key={plan.item.id}
                        className="flex gap-4 rounded-xl border border-mist-200 bg-white p-4"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-medium text-ivory">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">{plan.name}</p>
                          <p className="text-sm text-charcoal-500">
                            {plan.startTime} – {plan.endTime} · {plan.durationMinutes} min
                            {plan.distanceKm ? ` · ${plan.distanceKm} km` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {optimized.warnings.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {optimized.warnings.map((w) => (
                        <p
                          key={w}
                          className="flex items-start gap-2 rounded-xl bg-terracotta/5 p-3 text-sm text-terracotta"
                        >
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                          {w}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </section>
              ) : null}
            </>
          )}

          {recommendations.length > 0 ? (
            <section>
              <h2 className="mb-4 font-serif text-xl font-semibold">Recommended for You</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {recommendations.map((rec) => {
                  const dest =
                    rec.type === 'destination'
                      ? destinations.find((d) => d.id === rec.itemId)
                      : null;
                  const exp =
                    rec.type === 'experience' ? experiences.find((e) => e.id === rec.itemId) : null;
                  const name = dest?.name ?? exp?.name ?? '';
                  const url = dest
                    ? `/destinations/${dest.slug}`
                    : exp
                      ? `/experiences/${exp.slug}`
                      : '#';

                  return (
                    <Link
                      key={rec.itemId}
                      to={url}
                      className="rounded-xl border border-mist-200 bg-white p-4 transition-shadow hover:shadow-md"
                    >
                      <p className="font-medium text-charcoal hover:text-forest">{name}</p>
                      <p className="mt-1 text-xs capitalize text-charcoal-400">{rec.type}</p>
                      {rec.reasons[0] ? (
                        <p className="mt-2 text-xs text-forest">{rec.reasons[0]}</p>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>

        <div>
          <TerritoryMap
            destinations={destinations.filter((d) =>
              items.some((i) => i.type === 'destination' && i.itemId === d.id),
            )}
            className="mb-6 h-56"
          />
          <div className="rounded-2xl border border-mist-200 bg-white p-6 text-sm text-charcoal-600">
            <p className="mb-2 font-medium text-charcoal">Planning tip</p>
            <p>
              Save destinations and experiences as you browse. Our optimizer suggests a day plan
              based on distance, duration, and daylight safety.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
