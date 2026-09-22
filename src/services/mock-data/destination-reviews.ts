import type {
  AttractionCategory,
  Destination,
  DestinationReview,
  DestinationReviewSummary,
} from '@/types';

/**
 * Deterministic mock reviews for the 1M+ place catalog.
 * Reviews are generated on demand from a hash of the destination id, so the
 * same place always shows the same reviews without storing millions of rows.
 */

type ReviewTarget = Pick<Destination, 'id' | 'name' | 'category' | 'cityName' | 'placeKind'>;

const AUTHORS = [
  'Kasun P.',
  'Nimali F.',
  'Tharindu W.',
  'Ishara D.',
  'Sanduni R.',
  'Dinesh K.',
  'Amaya S.',
  'Ruwan J.',
  'Harsha M.',
  'Chathura B.',
  'Nadeesha L.',
  'Sajith A.',
  'Priya T.',
  'Arun V.',
  'Meera S.',
  'Emma L.',
  'Jonas K.',
  'Sophie M.',
  'Liam O.',
  'Hannah B.',
  'Marco R.',
  'Yuki T.',
  'Chloe D.',
  'Daniel H.',
  'Olivia W.',
  'Lucas G.',
  'Isabella C.',
  'Noah S.',
  'Mia F.',
  'Ethan J.',
] as const;

const SOURCES: DestinationReview['source'][] = ['resort_guest', 'local', 'traveller'];

const OPENERS_HIGH = [
  'Absolutely worth the trip.',
  'One of the highlights of our stay.',
  'Exceeded every expectation.',
  'A must-visit if you are in the area.',
  'We loved every minute here.',
  'Truly memorable experience.',
] as const;

const OPENERS_MID = [
  'Nice stop if you have time.',
  'Pleasant visit overall.',
  'Good experience, though it can get busy.',
  'Enjoyable, if a little crowded at peak hours.',
  'Worth a short visit.',
] as const;

const CATEGORY_LINES: Record<AttractionCategory, string[]> = {
  temple: [
    'The atmosphere during the evening puja was unforgettable.',
    'Beautiful murals and a very peaceful courtyard.',
    'Remember to dress modestly and remove shoes — the sand gets hot at noon.',
    'The resident monks were welcoming and shared some history with us.',
  ],
  viewpoint: [
    'Go at sunrise — the light over the hills is unreal.',
    'The panorama is fantastic; bring a jacket, it gets windy.',
    'Clear mornings give the best photos before the mist rolls in.',
    'The climb is short but the view rewards every step.',
  ],
  waterfall: [
    'The water was thundering after the rains — spectacular.',
    'Great natural pools; watch your footing on the wet rocks.',
    'Best visited in the morning before the tour buses arrive.',
    'The spray keeps everything cool even at midday.',
  ],
  tea_estate: [
    'The factory tour explained every stage from leaf to cup.',
    'Rolling green hills in every direction — bring your camera.',
    'The tasting at the end was the highlight for us.',
    'Our guide knew everything about the plucking rounds.',
  ],
  village: [
    'The craftspeople were happy to show us their work.',
    'Authentic village life, friendly faces everywhere.',
    'Try the local sweets from the roadside stalls.',
    'A gentle, unhurried glimpse of rural Sri Lanka.',
  ],
  trail: [
    'Well-marked path and stunning scenery the whole way.',
    'Carry plenty of water — the last stretch is steep.',
    'Leeches after rain, so wear proper socks!',
    'Our guide pointed out birds we would never have spotted.',
  ],
  historic: [
    'So much history packed into one site — take a guide.',
    'The stonework has survived centuries remarkably well.',
    'Informative plaques, though a local guide adds much more.',
    'Fascinating ruins; wear a hat as there is little shade.',
  ],
  market: [
    'Bargaining is expected — start at half the asking price.',
    'The spice stalls smell incredible; great value too.',
    'Go early for the freshest produce and fewer crowds.',
    'Bustling, noisy, colourful — everything a market should be.',
  ],
  nature: [
    'We spotted kingfishers, egrets, and a monitor lizard.',
    'Bring binoculars — the birdlife is outstanding.',
    'Serene and unspoiled; please carry your litter back.',
    'Golden hour here is a photographer’s dream.',
  ],
  education: [
    'A warm community place with a proud history.',
    'The staff shared wonderful stories about the area.',
    'Interesting stop to understand local life.',
    'Short visit, but a genuine slice of the community.',
  ],
  adventure_stop: [
    'The clue took us a while — great fun with the kids.',
    'Brilliant stop on the Hidden Trail; the puzzle was clever.',
    'Scanning the code and unlocking the story felt magical.',
    'A well-hidden waypoint — keep your eyes open!',
  ],
};

const CLOSERS = [
  'Will definitely come back.',
  'Highly recommended.',
  'Do not miss it.',
  'Added bonus: friendly locals nearby.',
  'Perfect addition to our itinerary.',
  'Five stars from our family.',
  'Would recommend to anyone visiting the region.',
  'A hidden treasure of the area.',
] as const;

/** FNV-1a string hash → 32-bit seed. */
function hashSeed(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Mulberry32 seeded PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function reviewCountFor(target: ReviewTarget, rand: () => number): number {
  if (target.placeKind === 'hidden_gem') return 1 + Math.floor(rand() * 5); // 1–5
  if (target.id.includes('-local-')) return 4 + Math.floor(rand() * 10); // 4–13
  return 12 + Math.floor(rand() * 24); // curated landmarks: 12–35
}

function ratingFor(rand: () => number): number {
  const r = rand();
  if (r < 0.55) return 5;
  if (r < 0.85) return 4;
  if (r < 0.96) return 3;
  return 2;
}

function visitedDate(rand: () => number): string {
  // Deterministic date within the ~24 months before the catalog snapshot.
  const base = Date.UTC(2026, 5, 30);
  const daysBack = Math.floor(rand() * 730);
  const d = new Date(base - daysBack * 86_400_000);
  return d.toISOString().slice(0, 10);
}

function buildComment(target: ReviewTarget, rating: number, rand: () => number): string {
  const opener = rating >= 4 ? pick(OPENERS_HIGH, rand) : pick(OPENERS_MID, rand);
  const line = pick(CATEGORY_LINES[target.category], rand);
  const parts = [opener, line];
  if (rating === 5 && rand() < 0.7) parts.push(pick(CLOSERS, rand));
  if (rating <= 3 && rand() < 0.5) {
    parts.push('Facilities could be better, but the visit was still worthwhile.');
  }
  return parts.join(' ');
}

/** Deterministic reviews for any destination (famous or hidden gem). */
export function getDestinationReviews(target: ReviewTarget): DestinationReview[] {
  const rand = mulberry32(hashSeed(target.id));
  const count = reviewCountFor(target, rand);
  const reviews: DestinationReview[] = [];
  const usedAuthors = new Set<number>();

  for (let i = 0; i < count; i++) {
    let authorIdx = Math.floor(rand() * AUTHORS.length);
    if (usedAuthors.has(authorIdx)) authorIdx = (authorIdx + i) % AUTHORS.length;
    usedAuthors.add(authorIdx);

    const rating = ratingFor(rand);
    reviews.push({
      id: `${target.id}-review-${i}`,
      destinationId: target.id,
      author: AUTHORS[authorIdx],
      rating,
      comment: buildComment(target, rating, rand),
      visitedOn: visitedDate(rand),
      source: pick(SOURCES, rand),
    });
  }

  return reviews.sort((a, b) => b.visitedOn.localeCompare(a.visitedOn));
}

export function getDestinationReviewSummary(target: ReviewTarget): DestinationReviewSummary {
  const reviews = getDestinationReviews(target);
  const averageRating = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 0;
  return { destinationId: target.id, averageRating, reviewCount: reviews.length };
}
