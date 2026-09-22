import { describe, it, expect } from 'vitest';
import {
  famousDestinations,
  FAMOUS_TARGET_PER_CITY,
} from '@/services/mock-data/sri-lanka-famous-places';
import { SRI_LANKA_CITIES } from '@/services/mock-data/sri-lanka-cities';
import { getCatalogStats } from '@/services/mock-data/sri-lanka-place-catalog';

describe('famous places coverage after Claude update', () => {
  it('exports at least 100 famous entries per city', () => {
    const byCity = new Map<string, number>();
    for (const d of famousDestinations) {
      byCity.set(d.cityId, (byCity.get(d.cityId) ?? 0) + 1);
    }

    for (const city of SRI_LANKA_CITIES) {
      expect(byCity.get(city.id) ?? 0, city.id).toBeGreaterThanOrEqual(FAMOUS_TARGET_PER_CITY);
    }
  });

  it('has curated real landmarks plus local fill', () => {
    const curated = famousDestinations.filter((d) => !d.id.includes('-local-'));
    const local = famousDestinations.filter((d) => d.id.includes('-local-'));

    expect(curated.length).toBeGreaterThan(100);
    expect(local.length).toBeGreaterThan(0);
    expect(famousDestinations.length).toBe(SRI_LANKA_CITIES.length * FAMOUS_TARGET_PER_CITY);
  });

  it('keeps catalog stats consistent', () => {
    const stats = getCatalogStats();
    expect(stats.famousCount).toBe(famousDestinations.length);
    expect(stats.totalPlaces).toBeGreaterThan(1_000_000);
  });

  it('has no invalid cityIds', () => {
    const citySet = new Set(SRI_LANKA_CITIES.map((c) => c.id));
    const bad = famousDestinations.filter((d) => !citySet.has(d.cityId));
    expect(bad).toEqual([]);
  });
});
