import type { RepositoryResult } from '@/types';
import type {
  TravelActivity,
  TravelGuide,
  TravelRegion,
  TravelTrail,
  TravelUpdate,
} from '@/types/travel';
import { mockRegions } from '../mock-data/travel-regions';
import { mockActivities } from '../mock-data/travel-activities';
import { mockTrails } from '../mock-data/travel-trails';
import { mockGuides } from '../mock-data/travel-guides';
import { mockUpdates } from '../mock-data/travel-updates';

export interface TravelRepository {
  getRegions(): Promise<RepositoryResult<TravelRegion[]>>;
  getFeaturedRegions(): Promise<RepositoryResult<TravelRegion[]>>;
  getRegionBySlug(slug: string): Promise<RepositoryResult<TravelRegion | null>>;
  getActivities(): Promise<RepositoryResult<TravelActivity[]>>;
  getFeaturedActivities(): Promise<RepositoryResult<TravelActivity[]>>;
  getActivityBySlug(slug: string): Promise<RepositoryResult<TravelActivity | null>>;
  getTrails(): Promise<RepositoryResult<TravelTrail[]>>;
  getFeaturedTrails(): Promise<RepositoryResult<TravelTrail[]>>;
  getTrailBySlug(slug: string): Promise<RepositoryResult<TravelTrail | null>>;
  getGuides(): Promise<RepositoryResult<TravelGuide[]>>;
  getFeaturedGuides(): Promise<RepositoryResult<TravelGuide[]>>;
  getGuideBySlug(slug: string): Promise<RepositoryResult<TravelGuide | null>>;
  getUpdates(): Promise<RepositoryResult<TravelUpdate[]>>;
  getFeaturedUpdates(): Promise<RepositoryResult<TravelUpdate[]>>;
  getUpdateBySlug(slug: string): Promise<RepositoryResult<TravelUpdate | null>>;
}

class LocalTravelRepository implements TravelRepository {
  async getRegions() {
    return { data: [...mockRegions] };
  }
  async getFeaturedRegions() {
    return { data: mockRegions.filter((r) => r.featured) };
  }
  async getRegionBySlug(slug: string) {
    return { data: mockRegions.find((r) => r.slug === slug) ?? null };
  }
  async getActivities() {
    return { data: [...mockActivities] };
  }
  async getFeaturedActivities() {
    return { data: mockActivities.filter((a) => a.featured) };
  }
  async getActivityBySlug(slug: string) {
    return { data: mockActivities.find((a) => a.slug === slug) ?? null };
  }
  async getTrails() {
    return { data: [...mockTrails] };
  }
  async getFeaturedTrails() {
    return { data: mockTrails.filter((t) => t.featured) };
  }
  async getTrailBySlug(slug: string) {
    return { data: mockTrails.find((t) => t.slug === slug) ?? null };
  }
  async getGuides() {
    return { data: [...mockGuides] };
  }
  async getFeaturedGuides() {
    return { data: mockGuides.filter((g) => g.featured) };
  }
  async getGuideBySlug(slug: string) {
    return { data: mockGuides.find((g) => g.slug === slug) ?? null };
  }
  async getUpdates() {
    return {
      data: [...mockUpdates].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    };
  }
  async getFeaturedUpdates() {
    return { data: mockUpdates.filter((u) => u.featured) };
  }
  async getUpdateBySlug(slug: string) {
    return { data: mockUpdates.find((u) => u.slug === slug) ?? null };
  }
}

export function createLocalTravelRepository(): TravelRepository {
  return new LocalTravelRepository();
}
