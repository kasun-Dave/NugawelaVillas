import { describe, it, expect } from 'vitest';
import { haversineKm, offsetLatLng, formatDistanceKm } from '@/utils/geo';
import { NUGAWELA_CENTRAL_COLLEGE } from '@/config/maps';
import { mockDestinations } from '@/services/mock-data/destinations';

describe('geo utilities', () => {
  it('formats short distances in metres', () => {
    expect(formatDistanceKm(0.4)).toBe('400 m');
    expect(formatDistanceKm(2.5)).toBe('2.5 km');
  });

  it('offset and haversine are consistent near NCC', () => {
    const point = offsetLatLng(NUGAWELA_CENTRAL_COLLEGE.lat, NUGAWELA_CENTRAL_COLLEGE.lng, 3, 90);
    const km = haversineKm(
      NUGAWELA_CENTRAL_COLLEGE.lat,
      NUGAWELA_CENTRAL_COLLEGE.lng,
      point.lat,
      point.lng,
    );
    expect(km).toBeGreaterThan(2.8);
    expect(km).toBeLessThan(3.2);
  });
});

describe('nugawela attractions', () => {
  it('generates at least 100 attractions from college hub', () => {
    expect(mockDestinations.length).toBeGreaterThanOrEqual(100);
    expect(mockDestinations.every((d) => d.category)).toBe(true);
    expect(mockDestinations.every((d) => d.distanceKm >= 0)).toBe(true);
  });
});
