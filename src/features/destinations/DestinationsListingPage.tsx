import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin,
  Clock,
  SlidersHorizontal,
  X,
  Search,
  Navigation,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { TerritoryMap } from '@/components/maps/TerritoryMap';
import { DirectionsPanel } from '@/components/maps/DirectionsPanel';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDistanceKm } from '@/utils/geo';
import { formatDuration } from '@/utils/format-duration';
import { useRouteComparison } from '@/hooks/useRouteDirections';
import type {
  AttractionCategory,
  Destination,
  PlaceKind,
  SriLankaProvince,
} from '@/types';
import type { RouteProfile } from '@/types/routing';

type DifficultyFilter = Destination['difficulty'] | '';

const PAGE_SIZE = 40;

export interface AttractionsListingProps {
  title?: string;
  subtitle?: string;
  /** When set, locks the type filter (used by Parks / Beaches / etc.). */
  presetCategory?: AttractionCategory | AttractionCategory[];
  /** Seed the search box (e.g. "beach", "wildlife") for themed hubs. */
  presetSearch?: string;
  basePath?: string;
}

const CATEGORY_OPTIONS: { value: AttractionCategory | ''; label: string }[] = [
  { value: '', label: 'All types' },
  { value: 'temple', label: 'Temples' },
  { value: 'viewpoint', label: 'Viewpoints' },
  { value: 'waterfall', label: 'Waterfalls' },
  { value: 'tea_estate', label: 'Tea estates' },
  { value: 'village', label: 'Villages' },
  { value: 'trail', label: 'Trails' },
  { value: 'historic', label: 'Historic' },
  { value: 'market', label: 'Markets' },
  { value: 'nature', label: 'Nature' },
  { value: 'education', label: 'Schools' },
  { value: 'adventure_stop', label: 'Adventure stops' },
];

const PROVINCE_OPTIONS: { value: SriLankaProvince | ''; label: string }[] = [
  { value: '', label: 'All provinces' },
  { value: 'Western', label: 'Western' },
  { value: 'Central', label: 'Central' },
  { value: 'Southern', label: 'Southern' },
  { value: 'Northern', label: 'Northern' },
  { value: 'Eastern', label: 'Eastern' },
  { value: 'North Western', label: 'North Western' },
  { value: 'North Central', label: 'North Central' },
  { value: 'Uva', label: 'Uva' },
  { value: 'Sabaragamuwa', label: 'Sabaragamuwa' },
];

function formatCount(n: number): string {
  return new Intl.NumberFormat('en-LK').format(n);
}

export function DestinationsListingPage({
  title = 'Attractions',
  subtitle = 'Browse famous landmarks and hidden gems across Sri Lanka — filter by city, type, and difficulty.',
  presetCategory,
  presetSearch = '',
  basePath = '/attractions',
}: AttractionsListingProps = {}) {
  const presetList = Array.isArray(presetCategory)
    ? presetCategory
    : presetCategory
      ? [presetCategory]
      : [];
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('');
  const [maxDistance, setMaxDistance] = useState('');
  const [category, setCategory] = useState<AttractionCategory | ''>(presetList[0] ?? '');
  const [placeKind, setPlaceKind] = useState<PlaceKind | ''>('');
  const [province, setProvince] = useState<SriLankaProvince | ''>('');
  const [cityId, setCityId] = useState('nugawela');
  const [search, setSearch] = useState(presetSearch);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [routeProfile, setRouteProfile] = useState<RouteProfile>('driving');

  const { data: statsData } = useQuery({
    queryKey: ['destinations', 'stats'],
    queryFn: () => repositories.destinations.getStats(),
  });

  const { data: citiesData } = useQuery({
    queryKey: ['destinations', 'cities'],
    queryFn: () => repositories.destinations.getCities(),
  });

  const cities = citiesData?.data ?? [];
  const stats = statsData?.data;

  const citiesInProvince = useMemo(() => {
    if (!province) return cities;
    return cities.filter((c) => c.province === province);
  }, [cities, province]);

  useEffect(() => {
    if (!citiesInProvince.length) return;
    if (!citiesInProvince.some((c) => c.id === cityId)) {
      setCityId(citiesInProvince[0].id);
      setPage(1);
    }
  }, [citiesInProvince, cityId]);

  const queryKey = [
    'destinations',
    'page',
    cityId,
    province,
    category,
    placeKind,
    difficulty,
    maxDistance,
    search,
    page,
  ];

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      repositories.destinations.query({
        cityId: placeKind === 'famous' && !cityId ? undefined : cityId || undefined,
        province: province || undefined,
        category: category || undefined,
        placeKind: placeKind || undefined,
        difficulty: difficulty || undefined,
        maxDistanceKm: maxDistance ? parseFloat(maxDistance) : undefined,
        search: search.trim() || undefined,
        page,
        pageSize: PAGE_SIZE,
      }),
    placeholderData: (prev) => prev,
  });

  const pageData = data?.data;
  const destinations = pageData?.items ?? [];
  const total = pageData?.total ?? 0;
  const totalPages = pageData?.totalPages ?? 1;
  const selectedCity = cities.find((c) => c.id === cityId);

  const selected = useMemo(
    () => destinations.find((d) => d.id === selectedId) ?? null,
    [destinations, selectedId],
  );

  const selectedCoords = selected?.coordinates
    ? { lat: selected.coordinates.lat, lng: selected.coordinates.lng }
    : null;

  const { driving, walking, isLoading: routesLoading, isError: routesError } =
    useRouteComparison(selectedCoords);

  const activeRoute = routeProfile === 'driving' ? driving.data : walking.data;

  const handlePinClick = useCallback((dest: Destination) => {
    setSelectedId(dest.id);
  }, []);

  const handleListSelect = useCallback((dest: Destination) => {
    setSelectedId(dest.id);
  }, []);

  const clearFilters = () => {
    setDifficulty('');
    setMaxDistance('');
    setCategory('');
    setPlaceKind('');
    setSearch('');
    setPage(1);
  };

  const hasFilters = Boolean(difficulty || maxDistance || category || placeKind || search);

  return (
    <div className="section-padding min-h-screen bg-ivory">
      <div className="container-narrow">
        <div className="mb-6">
          <h1 className="heading-section">{title}</h1>
          <p className="text-body mt-2 max-w-3xl">{subtitle}</p>
          {stats ? (
            <p className="mt-2 text-sm text-charcoal-500">
              Island catalog: {formatCount(stats.totalPlaces)}+ places · {stats.cityCount} cities ·{' '}
              {stats.districtCount} districts
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex flex-1 flex-col gap-4 lg:max-w-md">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <label className="mb-1 block text-xs font-medium">Province</label>
                <select
                  value={province}
                  onChange={(e) => {
                    setProvince(e.target.value as SriLankaProvince | '');
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-mist-200 px-3 py-2 text-sm"
                >
                  {PROVINCE_OPTIONS.map((opt) => (
                    <option key={opt.value || 'all'} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">City / town</label>
                <select
                  value={cityId}
                  onChange={(e) => {
                    setCityId(e.target.value);
                    setSelectedId(null);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-mist-200 px-3 py-2 text-sm"
                >
                  {citiesInProvince.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} ({city.district})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search places in this city…"
                className="pl-9"
                aria-label="Search attractions"
              />
            </div>

            <div
              className={`rounded-2xl border border-mist-200 bg-white p-4 ${showFilters ? 'block' : 'hidden lg:block'}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </h2>
                {hasFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs text-terracotta hover:underline"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <label className="mb-1 block text-xs font-medium">Place kind</label>
                  <select
                    value={placeKind}
                    onChange={(e) => {
                      setPlaceKind(e.target.value as PlaceKind | '');
                      setPage(1);
                    }}
                    className="w-full rounded-xl border border-mist-200 px-3 py-2 text-sm"
                  >
                    <option value="">Famous + hidden gems</option>
                    <option value="famous">Famous places only</option>
                    <option value="hidden_gem">Hidden gems only</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Type</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value as AttractionCategory | '');
                      setPage(1);
                    }}
                    className="w-full rounded-xl border border-mist-200 px-3 py-2 text-sm"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => {
                      setDifficulty(e.target.value as DifficultyFilter);
                      setPage(1);
                    }}
                    className="w-full rounded-xl border border-mist-200 px-3 py-2 text-sm"
                  >
                    <option value="">All levels</option>
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="challenging">Challenging</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Max distance from city hub</label>
                  <select
                    value={maxDistance}
                    onChange={(e) => {
                      setMaxDistance(e.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-xl border border-mist-200 px-3 py-2 text-sm"
                  >
                    <option value="">Any distance</option>
                    <option value="2">Up to 2 km</option>
                    <option value="5">Up to 5 km</option>
                    <option value="10">Up to 10 km</option>
                    <option value="15">Up to 15 km</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-charcoal-500">
                {formatCount(total)} place{total !== 1 ? 's' : ''}
                {selectedCity ? ` in ${selectedCity.name}` : ''}
                {isFetching ? ' · updating…' : ''}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
                Filters
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <p className="text-terracotta">Failed to load attractions.</p>
            ) : destinations.length === 0 ? (
              <div className="rounded-2xl border border-mist-200 bg-white py-12 text-center">
                <p className="text-charcoal-600">No attractions match your filters.</p>
              </div>
            ) : (
              <>
                <ul className="max-h-[32rem] space-y-2 overflow-y-auto pr-1">
                  {destinations.map((dest) => {
                    const isSelected = dest.id === selectedId;
                    return (
                      <li key={dest.id}>
                        <button
                          type="button"
                          onClick={() => handleListSelect(dest)}
                          className={`w-full rounded-xl border p-3 text-left transition-all ${
                            isSelected
                              ? 'border-terracotta bg-terracotta/5 shadow-sm ring-2 ring-terracotta/30'
                              : 'border-mist-200 bg-white hover:border-forest/30 hover:bg-forest-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-medium text-charcoal line-clamp-1">{dest.name}</p>
                              <p className="mt-0.5 text-xs capitalize text-charcoal-500">
                                {dest.placeKind === 'famous' ? 'Famous' : 'Hidden gem'} ·{' '}
                                {dest.category.replace('_', ' ')} · {dest.difficulty}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-full bg-mist px-2 py-0.5 text-xs font-medium text-charcoal-600">
                              {formatDistanceKm(dest.distanceKm)}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-xs text-charcoal-500">
                            <span className="flex items-center gap-1">
                              <Navigation className="h-3 w-3" /> {dest.cityName}
                            </span>
                            {driving.data && dest.id === selectedId ? (
                              <span className="flex items-center gap-1 text-forest">
                                <Clock className="h-3 w-3" />
                                {formatDuration(driving.data.durationSeconds)} drive
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {dest.travelTimeMinutes} min est.
                              </span>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </Button>
                  <p className="text-xs text-charcoal-500">
                    Page {page} of {formatCount(totalPages)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
            <TerritoryMap
              destinations={destinations}
              highlightedId={selectedId ?? undefined}
              className="h-64 sm:h-80 lg:h-[28rem]"
              onPinClick={handlePinClick}
              routeGeometry={activeRoute?.geometry}
              routeProfile={routeProfile}
            />

            {selected ? (
              <>
                <DirectionsPanel
                  destinationName={selected.name}
                  destinationCoords={selected.coordinates}
                  activeProfile={routeProfile}
                  onProfileChange={setRouteProfile}
                  drivingRoute={driving.data}
                  walkingRoute={walking.data}
                  isLoading={routesLoading}
                  isError={routesError}
                />
                <div className="rounded-2xl border border-mist-200 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-forest">
                        {selected.placeKind === 'famous' ? 'Famous place' : 'Hidden gem'} ·{' '}
                        {selected.district}
                      </p>
                      <h2 className="mt-1 font-serif text-lg font-semibold">{selected.name}</h2>
                      <p className="mt-1 text-sm text-charcoal-600">{selected.shortDescription}</p>
                    </div>
                    <div className="flex gap-3 text-sm text-charcoal-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-terracotta" />
                        {formatDistanceKm(selected.distanceKm)} from city hub
                      </span>
                    </div>
                  </div>
                  <Button asChild className="mt-4" variant="primary" size="sm">
                    <Link to={`${basePath}/${selected.slug}`}>
                      View full details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center text-sm text-charcoal-500">
                Tap a pin on the map or select from the list to highlight routes from the{' '}
                {selectedCity?.name ?? 'city'} hub.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
