import type { SearchResult, Destination, FAQ } from '@/types';
import type {
  TravelActivity,
  TravelGuide,
  TravelRegion,
  TravelTrail,
  TravelUpdate,
} from '@/types/travel';

interface SearchableItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: SearchResult['type'];
  keywords: string[];
  featured?: boolean;
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function scoreItem(item: SearchableItem, tokens: string[]): number {
  if (tokens.length === 0) return 0;

  const titleLower = item.title.toLowerCase();
  const descLower = item.description.toLowerCase();
  const keywordsLower = item.keywords.join(' ').toLowerCase();

  let score = 0;

  for (const token of tokens) {
    if (titleLower === token) score += 100;
    else if (titleLower.startsWith(token)) score += 50;
    else if (titleLower.includes(token)) score += 30;
    if (keywordsLower.includes(token)) score += 20;
    if (descLower.includes(token)) score += 10;
  }

  if (item.featured) score += 5;

  return score;
}

export function buildSearchIndex(
  destinations: Destination[],
  activities: TravelActivity[],
  trails: TravelTrail[],
  regions: TravelRegion[],
  guides: TravelGuide[],
  updates: TravelUpdate[],
  faqs: FAQ[] = [],
): SearchableItem[] {
  const items: SearchableItem[] = [];

  for (const dest of destinations) {
    items.push({
      id: dest.id,
      title: dest.name,
      description: dest.shortDescription,
      url: `/attractions/${dest.slug}`,
      type: 'attraction',
      keywords: [
        dest.difficulty,
        dest.category,
        dest.cityName,
        dest.province,
        dest.culturalContext,
        dest.placeKind,
      ],
      featured: dest.featured,
    });
  }

  for (const region of regions) {
    items.push({
      id: region.id,
      title: region.name,
      description: region.shortDescription,
      url: `/destinations/${region.slug}`,
      type: 'region',
      keywords: [...region.highlights, ...region.attractionTags, 'region', 'destination'],
      featured: region.featured,
    });
  }

  for (const activity of activities) {
    items.push({
      id: activity.id,
      title: activity.name,
      description: activity.shortDescription,
      url: `/activities/${activity.slug}`,
      type: 'activity',
      keywords: [activity.kind, activity.difficulty, activity.bestSeason, activity.duration],
      featured: activity.featured,
    });
  }

  for (const trail of trails) {
    items.push({
      id: trail.id,
      title: trail.name,
      description: trail.shortDescription,
      url: `/trails/${trail.slug}`,
      type: 'trail',
      keywords: [
        trail.difficulty,
        trail.bestSeason,
        ...trail.scenicHighlights,
        ...trail.nearbyAttractionHints,
        'hike',
        'trail',
      ],
      featured: trail.featured,
    });
  }

  for (const guide of guides) {
    items.push({
      id: guide.id,
      title: guide.title,
      description: guide.summary,
      url: `/guides/${guide.slug}`,
      type: 'guide',
      keywords: [guide.topic, 'guide', 'travel'],
      featured: guide.featured,
    });
  }

  for (const update of updates) {
    items.push({
      id: update.id,
      title: update.title,
      description: update.summary,
      url: `/updates/${update.slug}`,
      type: 'update',
      keywords: [update.category, 'news', 'advisory'],
      featured: update.featured,
    });
  }

  for (const faq of faqs) {
    items.push({
      id: faq.id,
      title: faq.question,
      description: faq.answer.slice(0, 120),
      url: `/search?q=${encodeURIComponent(faq.question)}`,
      type: 'faq',
      keywords: [...faq.tags, faq.category],
    });
  }

  return items;
}

export function searchItems(
  index: SearchableItem[],
  query: string,
  typeFilter?: SearchResult['type'],
  limit = 20,
): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  let results = index
    .map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      url: item.url,
      score: scoreItem(item, tokens),
    }))
    .filter((r) => r.score > 0);

  if (typeFilter) {
    results = results.filter((r) => r.type === typeFilter);
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
