import type { SearchResult, RepositoryResult } from '@/types';
import { getIndexedDestinations } from '../mock-data/destinations';
import { mockFaqs } from '../mock-data/faqs';
import { mockActivities } from '../mock-data/travel-activities';
import { mockTrails } from '../mock-data/travel-trails';
import { mockRegions } from '../mock-data/travel-regions';
import { mockGuides } from '../mock-data/travel-guides';
import { mockUpdates } from '../mock-data/travel-updates';
import { buildSearchIndex, searchItems } from '@/utils/search';

export interface SearchRepository {
  search(
    query: string,
    options?: { type?: SearchResult['type']; userId?: string },
  ): Promise<RepositoryResult<SearchResult[]>>;
}

const searchIndex = buildSearchIndex(
  getIndexedDestinations(40),
  mockActivities,
  mockTrails,
  mockRegions,
  mockGuides,
  mockUpdates,
  mockFaqs,
);

class LocalSearchRepository implements SearchRepository {
  async search(query: string, options?: { type?: SearchResult['type']; userId?: string }) {
    return { data: searchItems(searchIndex, query, options?.type) };
  }
}

export function createLocalSearchRepository(): SearchRepository {
  return new LocalSearchRepository();
}

export const searchRepository: SearchRepository = createLocalSearchRepository();
