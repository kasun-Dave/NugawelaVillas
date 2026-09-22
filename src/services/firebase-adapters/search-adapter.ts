import { getIndexedDestinations } from '../mock-data/destinations';
import { mockFaqs } from '../mock-data/faqs';
import { mockActivities } from '../mock-data/travel-activities';
import { mockTrails } from '../mock-data/travel-trails';
import { mockRegions } from '../mock-data/travel-regions';
import { mockGuides } from '../mock-data/travel-guides';
import { mockUpdates } from '../mock-data/travel-updates';
import { buildSearchIndex, searchItems } from '@/utils/search';
import type { SearchRepository } from '../repositories/search-repository';

const searchIndex = buildSearchIndex(
  getIndexedDestinations(40),
  mockActivities,
  mockTrails,
  mockRegions,
  mockGuides,
  mockUpdates,
  mockFaqs,
);

export function createFirebaseSearchRepository(): SearchRepository {
  return {
    async search(query, options) {
      return { data: searchItems(searchIndex, query, options?.type) };
    },
  };
}
