import type {
  Room,
  Experience,
  Destination,
  DestinationCatalogStats,
  DestinationPage,
  DestinationQuery,
  SriLankaCity,
  Testimonial,
  RepositoryResult,
} from '@/types';
import { mockRooms } from '../mock-data/rooms';
import { mockExperiences } from '../mock-data/experiences';
import {
  getCatalogStats,
  getDestinationById,
  getDestinationBySlug,
  getFeaturedDestinations,
  getIndexedDestinations,
  queryDestinations,
  SRI_LANKA_CITIES,
} from '../mock-data/destinations';
import { mockTestimonials } from '../mock-data/testimonials';
import {
  applyDestinationOverrides,
  applyExperienceOverrides,
} from '../mock-data/content-overrides-store';

export interface RoomRepository {
  getAll(): Promise<RepositoryResult<Room[]>>;
  getFeatured(): Promise<RepositoryResult<Room[]>>;
  getById(id: string): Promise<RepositoryResult<Room | null>>;
  getBySlug(slug: string): Promise<RepositoryResult<Room | null>>;
}

export interface ExperienceRepository {
  getAll(): Promise<RepositoryResult<Experience[]>>;
  getFeatured(): Promise<RepositoryResult<Experience[]>>;
  getById(id: string): Promise<RepositoryResult<Experience | null>>;
  getBySlug(slug: string): Promise<RepositoryResult<Experience | null>>;
}

export interface DestinationRepository {
  /** Indexed subset (famous + per-city samples) for search/home/itinerary. */
  getAll(): Promise<RepositoryResult<Destination[]>>;
  getFeatured(): Promise<RepositoryResult<Destination[]>>;
  getById(id: string): Promise<RepositoryResult<Destination | null>>;
  getBySlug(slug: string): Promise<RepositoryResult<Destination | null>>;
  query(query?: DestinationQuery): Promise<RepositoryResult<DestinationPage>>;
  getCities(): Promise<RepositoryResult<SriLankaCity[]>>;
  getStats(): Promise<RepositoryResult<DestinationCatalogStats>>;
}

export interface TestimonialRepository {
  getAll(): Promise<RepositoryResult<Testimonial[]>>;
}

export interface NewsletterRepository {
  subscribe(email: string): Promise<RepositoryResult<{ success: boolean }>>;
}

class MockRoomRepository implements RoomRepository {
  async getAll() {
    return { data: [...mockRooms] };
  }

  async getFeatured() {
    return { data: mockRooms.filter((r) => r.featured) };
  }

  async getById(id: string) {
    return { data: mockRooms.find((r) => r.id === id) ?? null };
  }

  async getBySlug(slug: string) {
    return { data: mockRooms.find((r) => r.slug === slug) ?? null };
  }
}

class MockExperienceRepository implements ExperienceRepository {
  async getAll() {
    return { data: applyExperienceOverrides([...mockExperiences]) };
  }

  async getFeatured() {
    return { data: applyExperienceOverrides(mockExperiences).filter((e) => e.featured) };
  }

  async getById(id: string) {
    const item = applyExperienceOverrides(mockExperiences).find((e) => e.id === id);
    return { data: item ?? null };
  }

  async getBySlug(slug: string) {
    const item = applyExperienceOverrides(mockExperiences).find((e) => e.slug === slug);
    return { data: item ?? null };
  }
}

class MockDestinationRepository implements DestinationRepository {
  async getAll() {
    return { data: applyDestinationOverrides(getIndexedDestinations()) };
  }

  async getFeatured() {
    return { data: applyDestinationOverrides(getFeaturedDestinations()) };
  }

  async getById(id: string) {
    const item = getDestinationById(id);
    return { data: item ? applyDestinationOverrides([item])[0] : null };
  }

  async getBySlug(slug: string) {
    const item = getDestinationBySlug(slug);
    return { data: item ? applyDestinationOverrides([item])[0] : null };
  }

  async query(query: DestinationQuery = {}) {
    const page = queryDestinations(query);
    return {
      data: {
        ...page,
        items: applyDestinationOverrides(page.items),
      },
    };
  }

  async getCities() {
    return { data: [...SRI_LANKA_CITIES] };
  }

  async getStats() {
    return { data: getCatalogStats() };
  }
}

class MockTestimonialRepository implements TestimonialRepository {
  async getAll() {
    return { data: [...mockTestimonials] };
  }
}

class LocalNewsletterRepository implements NewsletterRepository {
  async subscribe(email: string) {
    const { getStorageItem, setStorageItem, STORAGE_KEYS } = await import('@/utils/storage');
    const subs = getStorageItem<string[]>(STORAGE_KEYS.NEWSLETTER, []);
    if (!subs.includes(email)) {
      subs.push(email);
      setStorageItem(STORAGE_KEYS.NEWSLETTER, subs);
    }
    return { data: { success: true } };
  }
}

export function createLocalRoomRepository(): RoomRepository {
  return new MockRoomRepository();
}

export function createLocalExperienceRepository(): ExperienceRepository {
  return new MockExperienceRepository();
}

export function createLocalDestinationRepository(): DestinationRepository {
  return new MockDestinationRepository();
}

export function createLocalTestimonialRepository(): TestimonialRepository {
  return new MockTestimonialRepository();
}

export function createLocalNewsletterRepository(): NewsletterRepository {
  return new LocalNewsletterRepository();
}

export const roomRepository: RoomRepository = createLocalRoomRepository();
export const experienceRepository: ExperienceRepository = createLocalExperienceRepository();
export const destinationRepository: DestinationRepository = createLocalDestinationRepository();
export const testimonialRepository: TestimonialRepository = createLocalTestimonialRepository();
export const newsletterRepository: NewsletterRepository = createLocalNewsletterRepository();
