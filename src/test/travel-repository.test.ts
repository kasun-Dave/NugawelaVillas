import { describe, it, expect } from 'vitest';
import { createLocalTravelRepository } from '@/services/repositories/travel-repository';

const travel = createLocalTravelRepository();

describe('TravelRepository', () => {
  it('returns featured regions', async () => {
    const { data } = await travel.getFeaturedRegions();
    expect(data.length).toBeGreaterThan(0);
    expect(data.every((r) => r.featured)).toBe(true);
  });

  it('resolves region by slug', async () => {
    const { data: regions } = await travel.getRegions();
    const slug = regions[0]?.slug;
    expect(slug).toBeTruthy();
    const { data } = await travel.getRegionBySlug(slug!);
    expect(data?.slug).toBe(slug);
  });

  it('returns activities, trails, guides, and updates', async () => {
    const [activities, trails, guides, updates] = await Promise.all([
      travel.getActivities(),
      travel.getTrails(),
      travel.getGuides(),
      travel.getUpdates(),
    ]);
    expect(activities.data.length).toBeGreaterThan(0);
    expect(trails.data.length).toBeGreaterThan(0);
    expect(guides.data.length).toBeGreaterThan(0);
    expect(updates.data.length).toBeGreaterThan(0);
  });
});
