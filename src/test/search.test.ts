import { describe, it, expect } from 'vitest';
import { buildSearchIndex, searchItems } from '@/utils/search';
import { getIndexedDestinations } from '@/services/mock-data/destinations';
import { mockFaqs } from '@/services/mock-data/faqs';
import { mockActivities } from '@/services/mock-data/travel-activities';
import { mockTrails } from '@/services/mock-data/travel-trails';
import { mockRegions } from '@/services/mock-data/travel-regions';
import { mockGuides } from '@/services/mock-data/travel-guides';
import { mockUpdates } from '@/services/mock-data/travel-updates';

const index = buildSearchIndex(
  getIndexedDestinations(20),
  mockActivities,
  mockTrails,
  mockRegions,
  mockGuides,
  mockUpdates,
  mockFaqs,
);

describe('search utilities', () => {
  it('finds attractions by keyword', () => {
    const results = searchItems(index, 'waterfall');
    expect(results.some((r) => r.type === 'attraction')).toBe(true);
  });

  it('finds destinations/regions', () => {
    const results = searchItems(index, 'hill');
    expect(results.some((r) => r.type === 'region' || r.type === 'attraction')).toBe(true);
  });

  it('finds activities', () => {
    const results = searchItems(index, mockActivities[0]?.name.split(' ')[0] ?? 'hike');
    expect(results.length).toBeGreaterThan(0);
  });

  it('finds trails', () => {
    const results = searchItems(index, 'trail');
    expect(results.some((r) => r.type === 'trail' || r.type === 'attraction')).toBe(true);
  });

  it('finds FAQs', () => {
    const results = searchItems(index, 'cancellation');
    expect(results.some((r) => r.type === 'faq')).toBe(true);
  });

  it('returns empty for short queries', () => {
    expect(searchItems(index, 'a')).toHaveLength(0);
  });
});
