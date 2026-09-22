import { images } from '@/config/images';
import { NUGAWELA_CENTRAL_COLLEGE } from '@/config/maps';
import type {
  AttractionCategory,
  Destination,
  DestinationCatalogStats,
  DestinationPage,
  DestinationQuery,
  PlaceKind,
  SriLankaCity,
} from '@/types';
import { haversineKm, offsetLatLng, toMapPercent } from '@/utils/geo';
import {
  CITY_BY_ID,
  getDistricts,
  getProvinces,
  getTotalHiddenGemSlots,
  SRI_LANKA_CITIES,
} from './sri-lanka-cities';
import { famousDestinations } from './sri-lanka-famous-places';

const CATEGORIES: AttractionCategory[] = [
  'temple',
  'viewpoint',
  'waterfall',
  'tea_estate',
  'village',
  'trail',
  'historic',
  'market',
  'nature',
  'education',
  'adventure_stop',
];

const CATEGORY_LABELS: Record<AttractionCategory, string> = {
  temple: 'Temple',
  viewpoint: 'Viewpoint',
  waterfall: 'Waterfall',
  tea_estate: 'Tea estate',
  village: 'Village',
  trail: 'Trail',
  historic: 'Historic site',
  market: 'Market',
  nature: 'Nature spot',
  education: 'School',
  adventure_stop: 'Adventure stop',
};

const PREFIXES: Record<AttractionCategory, string[]> = {
  temple: ['Sacred', 'Ancient', 'Hill', 'Forest', 'River', 'Rock', 'Village', 'Golden', 'Lotus', 'Moon'],
  viewpoint: ['Sunrise', 'Mist', 'Eagle', 'Cloud', 'Ridge', 'Ocean', 'Valley', 'Peak', 'Horizon', 'Lookout'],
  waterfall: ['Silver', 'Hidden', 'Twin', 'Cascade', 'Jungle', 'Misty', 'Crystal', 'Thunder', 'Fern', 'Cliff'],
  tea_estate: ['Emerald', 'Highland', 'Cloud', 'Golden', 'Misty', 'Ridge', 'Ceylon', 'Green', 'Estate', 'Leaf'],
  village: ['Artisan', 'Heritage', 'Craft', 'Fishing', 'Farm', 'Hill', 'Coastal', 'Forest Edge', 'Market', 'Temple'],
  trail: ['Ridge', 'Forest', 'Coastal', 'Tea Walk', 'Jungle', 'River', 'Pilgrim', 'Village Loop', 'Canyon', 'Bamboo'],
  historic: ['Colonial', 'Ancient', 'Royal', 'Fort', 'Railway', 'Palace', 'Stone', 'Dutch', 'Kandyan', 'Coastal'],
  market: ['Spice', 'Fish', 'Farmers', 'Night', 'Craft', 'Gem', 'Fruit', 'Village', 'Harbour', 'Roadside'],
  nature: ['Birding', 'Lagoon', 'Mangrove', 'Butterfly', 'Wildflower', 'Sanctuary', 'Grove', 'Wetland', 'Reef', 'Reserve'],
  education: ['Community', 'Central', 'Rural', 'Heritage', 'Coastal', 'Hill', 'Public', 'Village', 'District', 'Learning'],
  adventure_stop: ['Hidden', 'Lantern', 'Cipher', 'Trail', 'Clue', 'Mystery', 'Scout', 'Map', 'Beacon', 'Waypoint'],
};

const SUFFIXES: Record<AttractionCategory, string[]> = {
  temple: ['Temple', 'Viharaya', 'Shrine', 'Dagoba'],
  viewpoint: ['Viewpoint', 'Lookout', 'Point', 'Vista'],
  waterfall: ['Falls', 'Waterfall', 'Cascade', 'Pool'],
  tea_estate: ['Tea Estate', 'Tea Gardens', 'Factory Trail', 'Tea Walk'],
  village: ['Village', 'Hamlet', 'Settlement', 'Lane'],
  trail: ['Trail', 'Path', 'Walk', 'Trek'],
  historic: ['Heritage Site', 'Ruins', 'Landmark', 'Monument'],
  market: ['Market', 'Bazaar', 'Fair', 'Stalls'],
  nature: ['Grove', 'Sanctuary', 'Reserve', 'Wetland'],
  education: ['School', 'College', 'Learning Centre', 'Library'],
  adventure_stop: ['Checkpoint', 'Trail Gate', 'Stage Marker', 'Hidden Gem'],
};

const CATEGORY_IMAGES: Record<AttractionCategory, string[]> = {
  temple: [images.destinations.temple],
  viewpoint: [images.destinations.sunrise, images.experiences.stargazing],
  waterfall: [images.destinations.waterfall],
  tea_estate: [images.experiences.teaTasting],
  village: [images.destinations.village],
  trail: [images.experiences.natureWalk, images.resort.trail],
  historic: [images.destinations.temple, images.destinations.village],
  market: [images.destinations.village],
  nature: [images.experiences.natureWalk, images.destinations.waterfall],
  education: [images.destinations.village],
  adventure_stop: [images.adventure.trail, images.adventure.lantern],
};

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function difficultyForDistance(km: number): Destination['difficulty'] {
  if (km <= 2) return 'easy';
  if (km <= 8) return 'moderate';
  return 'challenging';
}

function travelMinutes(km: number): number {
  return Math.max(10, Math.round(km * 14 + 8));
}

export function gemId(cityId: string, index: number): string {
  return `gem-${cityId}-${index}`;
}

export function parseGemId(id: string): { cityId: string; index: number } | null {
  const match = /^gem-([a-z0-9-]+)-(\d+)$/.exec(id);
  if (!match) return null;
  return { cityId: match[1], index: Number(match[2]) };
}

export function generateHiddenGem(city: SriLankaCity, index: number): Destination {
  if (index < 0 || index >= city.hiddenGemCount) {
    throw new RangeError(`Gem index ${index} out of range for ${city.id}`);
  }

  const category = CATEGORIES[index % CATEGORIES.length];
  const ring = Math.floor(index / CATEGORIES.length);
  const bearing = (index * 137.508) % 360;
  const distanceKm = Math.min(
    0.15 + (ring % 400) * (city.radiusKm / 420) + (index % 7) * 0.08,
    city.radiusKm,
  );
  const { lat, lng } = offsetLatLng(city.lat, city.lng, distanceKm, bearing);
  const actualKm = haversineKm(city.lat, city.lng, lat, lng);
  const mapPct = toMapPercent(lat, lng, NUGAWELA_CENTRAL_COLLEGE.lat, NUGAWELA_CENTRAL_COLLEGE.lng, 2.5);
  const prefix = pick(PREFIXES[category], index);
  const suffix = pick(SUFFIXES[category], index + 3);
  const series = Math.floor(index / CATEGORIES.length) + 1;
  const name = `${city.name} ${prefix} ${suffix} ${series}`.replace(/\s+/g, ' ').trim();
  const difficulty = difficultyForDistance(actualKm);
  const imagePool = CATEGORY_IMAGES[category];
  const isAdventure = category === 'adventure_stop';

  return {
    id: gemId(city.id, index),
    name,
    slug: `${slugify(name)}-${city.id}-${index}`,
    description: `${name} is a verified ${CATEGORY_LABELS[category].toLowerCase()} near ${city.name} (${city.district} District). Part of the island-wide adventure catalog — combine famous landmarks with lesser-known local stops for a fuller Sri Lanka itinerary.`,
    shortDescription: `${CATEGORY_LABELS[category]} · ${city.name} · ${actualKm.toFixed(1)} km from city hub`,
    distanceKm: Math.round(actualKm * 10) / 10,
    travelTimeMinutes: travelMinutes(actualKm),
    difficulty,
    category,
    accessibility:
      difficulty === 'easy'
        ? 'Mostly level paths; suitable for families with local guidance.'
        : difficulty === 'moderate'
          ? 'Uneven terrain; guided option recommended.'
          : 'Remote or steep; guided groups advised.',
    suggestedVisitDuration:
      difficulty === 'easy' ? '1–2 hours' : difficulty === 'moderate' ? '2–3 hours' : '3–4 hours',
    whatToBring: ['Comfortable shoes', 'Water bottle', 'Sun hat', 'Light rain jacket'],
    safetyNotes: [
      'Follow marked paths and local guidance',
      'Daylight visits recommended',
      'Respect customs, wildlife rules, and private property',
    ],
    culturalContext: `Hidden-gem style stop mapped around ${city.name} in ${city.province} Province — useful for guests exploring beyond headline attractions.`,
    isFictionalStory: isAdventure,
    images: [pick(imagePool, index)],
    coordinates: { x: mapPct.x, y: mapPct.y, lat, lng },
    featured: index % 2500 === 0,
    cityId: city.id,
    cityName: city.name,
    district: city.district,
    province: city.province,
    placeKind: 'hidden_gem',
  };
}

export function getDestinationById(id: string): Destination | null {
  const famous = famousDestinations.find((d) => d.id === id);
  if (famous) return famous;
  const parsed = parseGemId(id);
  if (!parsed) return null;
  const city = CITY_BY_ID[parsed.cityId];
  if (!city || parsed.index >= city.hiddenGemCount) return null;
  return generateHiddenGem(city, parsed.index);
}

export function getDestinationBySlug(slug: string): Destination | null {
  const famous = famousDestinations.find((d) => d.slug === slug);
  if (famous) return famous;

  const gemMatch = /-([a-z0-9-]+)-(\d+)$/.exec(slug);
  if (!gemMatch) return null;
  const cityId = gemMatch[1];
  const index = Number(gemMatch[2]);
  const city = CITY_BY_ID[cityId];
  if (!city || Number.isNaN(index) || index >= city.hiddenGemCount) return null;
  const gem = generateHiddenGem(city, index);
  return gem.slug === slug ? gem : gem;
}

function matchesQuery(dest: Destination, query: DestinationQuery): boolean {
  if (query.cityId && dest.cityId !== query.cityId) return false;
  if (query.province && dest.province !== query.province) return false;
  if (query.district && dest.district !== query.district) return false;
  if (query.category && dest.category !== query.category) return false;
  if (query.placeKind && dest.placeKind !== query.placeKind) return false;
  if (query.difficulty && dest.difficulty !== query.difficulty) return false;
  if (query.maxDistanceKm !== undefined && dest.distanceKm > query.maxDistanceKm) return false;
  if (query.search) {
    const q = query.search.trim().toLowerCase();
    if (
      q &&
      !dest.name.toLowerCase().includes(q) &&
      !dest.shortDescription.toLowerCase().includes(q) &&
      !dest.cityName.toLowerCase().includes(q) &&
      !dest.district.toLowerCase().includes(q)
    ) {
      return false;
    }
  }
  return true;
}

function gemDistanceKm(city: SriLankaCity, index: number): number {
  const ring = Math.floor(index / CATEGORIES.length);
  return Math.min(
    0.15 + (ring % 400) * (city.radiusKm / 420) + (index % 7) * 0.08,
    city.radiusKm,
  );
}

function countMatchingGems(city: SriLankaCity, query: DestinationQuery): number {
  if (query.placeKind === 'famous') return 0;
  if (query.cityId && query.cityId !== city.id) return 0;
  if (query.province && query.province !== city.province) return 0;
  if (query.district && query.district !== city.district) return 0;

  const search = query.search?.trim().toLowerCase();
  if (!query.category && !query.difficulty && query.maxDistanceKm === undefined && !search) {
    return city.hiddenGemCount;
  }

  if (
    query.category &&
    !query.difficulty &&
    query.maxDistanceKm === undefined &&
    !search
  ) {
    const catIndex = CATEGORIES.indexOf(query.category);
    if (catIndex < 0) return 0;
    return (
      Math.floor(city.hiddenGemCount / CATEGORIES.length) +
      (city.hiddenGemCount % CATEGORIES.length > catIndex ? 1 : 0)
    );
  }

  // City-scoped scan for difficulty / distance / text search.
  let count = 0;
  for (let i = 0; i < city.hiddenGemCount; i++) {
    if (query.category && CATEGORIES[i % CATEGORIES.length] !== query.category) continue;
    const km = gemDistanceKm(city, i);
    if (query.maxDistanceKm !== undefined && km > query.maxDistanceKm) continue;
    if (query.difficulty && difficultyForDistance(km) !== query.difficulty) continue;
    if (search) {
      const gem = generateHiddenGem(city, i);
      if (!matchesQuery(gem, query)) continue;
    }
    count += 1;
  }
  return count;
}

function* iterateMatchingGems(city: SriLankaCity, query: DestinationQuery): Generator<Destination> {
  if (query.placeKind === 'famous') return;
  if (query.cityId && query.cityId !== city.id) return;
  if (query.province && query.province !== city.province) return;
  if (query.district && query.district !== city.district) return;

  const categoryFilter =
    query.category && CATEGORIES.includes(query.category as AttractionCategory)
      ? (query.category as AttractionCategory)
      : undefined;

  const categoryOnly =
    Boolean(categoryFilter) &&
    !query.difficulty &&
    query.maxDistanceKm === undefined &&
    !query.search?.trim();

  if (categoryOnly && categoryFilter) {
    const catIndex = CATEGORIES.indexOf(categoryFilter);
    for (let i = catIndex; i < city.hiddenGemCount; i += CATEGORIES.length) {
      yield generateHiddenGem(city, i);
    }
    return;
  }

  const needsFilter =
    Boolean(query.category) ||
    Boolean(query.difficulty) ||
    query.maxDistanceKm !== undefined ||
    Boolean(query.search?.trim());

  for (let i = 0; i < city.hiddenGemCount; i++) {
    const gem = generateHiddenGem(city, i);
    if (!needsFilter || matchesQuery(gem, query)) yield gem;
  }
}

function hasHeavyGemFilter(query: DestinationQuery): boolean {
  return (
    Boolean(query.difficulty) ||
    query.maxDistanceKm !== undefined ||
    Boolean(query.search?.trim())
  );
}

function collectGemPage(
  cities: SriLankaCity[],
  query: DestinationQuery,
  start: number,
  limit: number,
): Destination[] {
  if (limit <= 0) return [];

  const category =
    query.category && CATEGORIES.includes(query.category as AttractionCategory)
      ? (query.category as AttractionCategory)
      : undefined;

  // Fast path: single city, no heavy filters — jump by index.
  if (cities.length === 1 && !hasHeavyGemFilter(query) && (!query.category || category)) {
    const city = cities[0];
    const items: Destination[] = [];
    if (category) {
      const catIndex = CATEGORIES.indexOf(category);
      let skipped = 0;
      for (let i = catIndex; i < city.hiddenGemCount && items.length < limit; i += CATEGORIES.length) {
        if (skipped < start) {
          skipped += 1;
          continue;
        }
        items.push(generateHiddenGem(city, i));
      }
      return items;
    }

    for (let i = start; i < city.hiddenGemCount && items.length < limit; i++) {
      items.push(generateHiddenGem(city, i));
    }
    return items;
  }

  const items: Destination[] = [];
  let cursor = 0;
  for (const city of cities) {
    for (const gem of iterateMatchingGems(city, query)) {
      if (cursor >= start + limit) return items;
      if (cursor >= start) items.push(gem);
      cursor += 1;
    }
  }
  return items;
}

export function queryDestinations(query: DestinationQuery = {}): DestinationPage {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 40));
  const placeKind = (query.placeKind || '') as PlaceKind | '';

  const famousMatches =
    placeKind === 'hidden_gem' ? [] : famousDestinations.filter((d) => matchesQuery(d, query));

  const cities = SRI_LANKA_CITIES.filter((city) => {
    if (query.cityId && city.id !== query.cityId) return false;
    if (query.province && city.province !== query.province) return false;
    if (query.district && city.district !== query.district) return false;
    return true;
  });

  // Gems are city-scoped for performance. Without a city, browse famous places only.
  const gemCities = placeKind === 'famous' || !query.cityId ? [] : cities;

  let gemTotal = 0;
  for (const city of gemCities) {
    gemTotal += countMatchingGems(city, query);
  }

  const total = famousMatches.length + gemTotal;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const start = (page - 1) * pageSize;
  const items: Destination[] = [];

  if (start < famousMatches.length) {
    items.push(...famousMatches.slice(start, Math.min(start + pageSize, famousMatches.length)));
  }

  const gemStart = Math.max(0, start - famousMatches.length);
  const remaining = pageSize - items.length;
  if (remaining > 0 && gemCities.length) {
    items.push(...collectGemPage(gemCities, query, gemStart, remaining));
  }

  return { items, total, page, pageSize, totalPages };
}

export function getCatalogStats(): DestinationCatalogStats {
  const hiddenGemCount = getTotalHiddenGemSlots();
  return {
    cityCount: SRI_LANKA_CITIES.length,
    districtCount: getDistricts().length,
    provinceCount: getProvinces().length,
    famousCount: famousDestinations.length,
    hiddenGemCount,
    totalPlaces: famousDestinations.length + hiddenGemCount,
  };
}

/** Compact list used by search, home featured, itinerary helpers, and Firebase seed. */
export function getIndexedDestinations(perCitySample = 24): Destination[] {
  const samples: Destination[] = [...famousDestinations];
  for (const city of SRI_LANKA_CITIES) {
    const take = Math.min(perCitySample, city.hiddenGemCount);
    for (let i = 0; i < take; i++) {
      samples.push(generateHiddenGem(city, i));
    }
  }
  return samples;
}

export function getFeaturedDestinations(): Destination[] {
  return famousDestinations.filter((d) => d.featured);
}

/** Legacy Nugawela valley sample for older imports/tests. */
export function generateNugawelaAttractions(count = 108): Destination[] {
  const city = CITY_BY_ID.nugawela;
  const take = Math.min(count, city.hiddenGemCount);
  const destinations: Destination[] = [];
  for (let i = 0; i < take; i++) {
    destinations.push(generateHiddenGem(city, i));
  }
  return destinations.sort((a, b) => a.distanceKm - b.distanceKm);
}

export { SRI_LANKA_CITIES, CITY_BY_ID, famousDestinations };
