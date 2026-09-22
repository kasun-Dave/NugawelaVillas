import { describe, it, expect } from 'vitest';
import { getRecommendations } from '@/utils/recommendations';
import { mockDestinations } from '@/services/mock-data/destinations';
import { mockExperiences } from '@/services/mock-data/experiences';
import type { GuestPreferences } from '@/types';

const basePrefs: GuestPreferences = {
  accessibilityMode: false,
  newsletterOptIn: false,
  adventureHintsEnabled: true,
  notificationEmail: true,
  notificationPush: false,
  interests: [],
};

describe('recommendation engine', () => {
  it('returns featured items when no interests set', () => {
    const recs = getRecommendations(mockDestinations, mockExperiences, basePrefs);
    expect(recs.length).toBeGreaterThan(0);
  });

  it('scores nature interests toward nature content', () => {
    const prefs: GuestPreferences = { ...basePrefs, interests: ['nature'] };
    const recs = getRecommendations(mockDestinations, mockExperiences, prefs);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].score).toBeGreaterThan(0);
  });

  it('boosts easy destinations for accessibility mode', () => {
    const prefs: GuestPreferences = { ...basePrefs, accessibilityMode: true };
    const recs = getRecommendations(mockDestinations, mockExperiences, prefs);
    const easyDest = mockDestinations.find((d) => d.difficulty === 'easy');
    if (easyDest) {
      const score = recs.find((r) => r.itemId === easyDest.id);
      expect(score?.reasons.some((r) => r.includes('Easy access'))).toBe(true);
    }
  });
});
