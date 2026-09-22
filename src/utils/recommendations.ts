import type { Destination, Experience, GuestPreferences } from '@/types';

export interface RecommendationScore {
  itemId: string;
  type: 'destination' | 'experience';
  score: number;
  reasons: string[];
}

const INTEREST_KEYWORDS: Record<string, string[]> = {
  nature: ['forest', 'trail', 'waterfall', 'stream', 'nature', 'bird', 'garden'],
  culture: ['village', 'heritage', 'temple', 'artisan', 'story', 'cultural'],
  adventure: ['sunrise', 'ridge', 'stargazing', 'hike', 'trail', 'adventure'],
  culinary: ['tea', 'food', 'dining', 'campfire', 'culinary'],
  photography: ['sunrise', 'viewpoint', 'waterfall', 'ridge', 'scenic'],
  family: ['village', 'easy', 'family', 'picnic', 'garden'],
};

function matchesKeywords(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.filter((k) => lower.includes(k)).length;
}

export function scoreDestination(
  dest: Destination,
  preferences: GuestPreferences,
): RecommendationScore {
  let score = 0;
  const reasons: string[] = [];

  if (dest.featured) {
    score += 10;
    reasons.push('Featured destination');
  }

  if (dest.difficulty === 'easy' && preferences.accessibilityMode) {
    score += 25;
    reasons.push('Easy access route');
  }

  for (const interest of preferences.interests) {
    const keywords = INTEREST_KEYWORDS[interest] ?? [interest];
    const text = `${dest.name} ${dest.description} ${dest.shortDescription} ${dest.culturalContext}`;
    const matches = matchesKeywords(text, keywords);
    if (matches > 0) {
      score += matches * 15;
      reasons.push(`Matches your interest: ${interest}`);
    }
  }

  if (dest.distanceKm <= 2) {
    score += 8;
    reasons.push('Close to resort');
  }

  return { itemId: dest.id, type: 'destination', score, reasons };
}

export function scoreExperience(
  exp: Experience,
  preferences: GuestPreferences,
): RecommendationScore {
  let score = 0;
  const reasons: string[] = [];

  if (exp.featured) {
    score += 10;
    reasons.push('Featured experience');
  }

  for (const interest of preferences.interests) {
    const keywords = INTEREST_KEYWORDS[interest] ?? [interest];
    if (
      keywords.includes(exp.category) ||
      matchesKeywords(exp.name + exp.description, keywords) > 0
    ) {
      score += 20;
      reasons.push(`Matches your interest: ${interest}`);
    }
  }

  return { itemId: exp.id, type: 'experience', score, reasons };
}

export function getRecommendations(
  destinations: Destination[],
  experiences: Experience[],
  preferences: GuestPreferences,
  limit = 6,
): RecommendationScore[] {
  const destScores = destinations.map((d) => scoreDestination(d, preferences));
  const expScores = experiences.map((e) => scoreExperience(e, preferences));

  const all = [...destScores, ...expScores]
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (all.length === 0) {
    const fallback = [
      ...destinations
        .filter((d) => d.featured)
        .map((d) => ({
          itemId: d.id,
          type: 'destination' as const,
          score: 5,
          reasons: ['Popular with guests'],
        })),
      ...experiences
        .filter((e) => e.featured)
        .map((e) => ({
          itemId: e.id,
          type: 'experience' as const,
          score: 5,
          reasons: ['Popular with guests'],
        })),
    ];
    return fallback.slice(0, limit);
  }

  return all.slice(0, limit);
}
