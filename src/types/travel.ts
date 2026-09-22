export type TravelSeason = 'year_round' | 'dry' | 'wet' | 'shoulder';

export interface TravelRegion {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  overview: string;
  bestTimeToVisit: string;
  highlights: string[];
  thingsToDo: string[];
  nature: string;
  culture: string;
  food: string;
  photographySpots: string[];
  suggestedItineraries: { title: string; days: string; summary: string }[];
  nearbyCityIds: string[];
  attractionTags: string[];
  images: string[];
  featured: boolean;
}

export type ActivityKind =
  | 'hiking'
  | 'wildlife'
  | 'water'
  | 'culture'
  | 'food'
  | 'adventure'
  | 'train'
  | 'wellness';

export interface TravelActivity {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  overview: string;
  kind: ActivityKind;
  difficulty: 'easy' | 'moderate' | 'challenging';
  bestSeason: string;
  duration: string;
  whatToBring: string[];
  safety: string[];
  nearbyRegionIds: string[];
  images: string[];
  featured: boolean;
}

export interface TravelTrail {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  overview: string;
  distanceKm: number;
  durationHours: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  elevationGainM: number;
  scenicHighlights: string[];
  bestSeason: string;
  safetyAdvice: string[];
  nearbyAttractionHints: string[];
  regionId: string;
  images: string[];
  featured: boolean;
}

export type GuideTopic =
  | 'first_time'
  | 'regional'
  | 'culture'
  | 'transport'
  | 'budget'
  | 'family'
  | 'adventure'
  | 'food'
  | 'wildlife'
  | 'photography'
  | 'seasonal'
  | 'packing';

export interface TravelGuide {
  id: string;
  title: string;
  slug: string;
  summary: string;
  topic: GuideTopic;
  readingMinutes: number;
  sections: { heading: string; body: string }[];
  relatedRegionIds: string[];
  images: string[];
  featured: boolean;
  publishedAt: string;
}

export type UpdateCategory =
  | 'news'
  | 'seasonal'
  | 'festival'
  | 'park'
  | 'trail'
  | 'advisory'
  | 'conservation'
  | 'event';

export interface TravelUpdate {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  category: UpdateCategory;
  publishedAt: string;
  featured: boolean;
  relatedSlugs?: string[];
}
