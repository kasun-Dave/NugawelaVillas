import { describe, it, expect } from 'vitest';
import {
  getCatalogStats,
  getDestinationById,
  queryDestinations,
  SRI_LANKA_CITIES,
  famousDestinations,
} from '@/services/mock-data/destinations';
import { getDistricts, getTotalHiddenGemSlots } from '@/services/mock-data/sri-lanka-cities';

describe('Sri Lanka place catalog', () => {
  it('covers all 25 districts and 9 provinces', () => {
    expect(getDistricts()).toHaveLength(25);
    const provinces = new Set(SRI_LANKA_CITIES.map((c) => c.province));
    expect(provinces.size).toBe(9);
    expect(SRI_LANKA_CITIES.length).toBeGreaterThanOrEqual(80);
  });

  it('exceeds one million total places', () => {
    const stats = getCatalogStats();
    expect(getTotalHiddenGemSlots()).toBeGreaterThanOrEqual(1_000_000);
    expect(stats.totalPlaces).toBeGreaterThanOrEqual(1_000_000);
    expect(stats.famousCount).toBe(famousDestinations.length);
    expect(stats.famousCount).toBeGreaterThan(50);
  });

  it('generates deterministic city-scoped gems', () => {
    const a = getDestinationById('gem-kandy-0');
    const b = getDestinationById('gem-kandy-0');
    expect(a).not.toBeNull();
    expect(a?.cityId).toBe('kandy');
    expect(a?.placeKind).toBe('hidden_gem');
    expect(a?.id).toBe(b?.id);
    expect(a?.coordinates.lat).toBe(b?.coordinates.lat);
  });

  it('pages Nugawela gems without loading the full island catalog', () => {
    const page = queryDestinations({
      cityId: 'nugawela',
      placeKind: 'hidden_gem',
      page: 1,
      pageSize: 40,
    });
    expect(page.items).toHaveLength(40);
    expect(page.total).toBeGreaterThan(10_000);
    expect(page.items.every((d) => d.cityId === 'nugawela')).toBe(true);
  });

  it('lists famous places for a city', () => {
    const page = queryDestinations({
      cityId: 'kandy',
      placeKind: 'famous',
      page: 1,
      pageSize: 20,
    });
    expect(page.total).toBeGreaterThan(0);
    expect(page.items.every((d) => d.placeKind === 'famous')).toBe(true);
  });
});
