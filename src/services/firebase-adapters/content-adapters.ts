import type { Room, Experience, Destination, DestinationQuery, Testimonial } from '@/types';
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
import type {
  RoomRepository,
  ExperienceRepository,
  DestinationRepository,
  TestimonialRepository,
  NewsletterRepository,
} from '../repositories/content-repositories';
import { COLLECTIONS } from '../firebase/collections';
import { fetchCollection, fetchDocument, upsertDocument } from '../firebase/firestore-helpers';
import type { ContentOverrides } from '../mock-data/content-overrides-store';

const emptyOverrides: ContentOverrides = { destinations: {}, experiences: {} };

async function loadOverrides(): Promise<ContentOverrides> {
  const doc = await fetchDocument<ContentOverrides>(COLLECTIONS.CONTENT_OVERRIDES, 'default');
  return doc ?? emptyOverrides;
}

function applyDestinationOverrides<T extends { id: string; featured: boolean }>(
  items: T[],
  overrides: ContentOverrides,
): T[] {
  return items.map((item) => {
    const o = overrides.destinations[item.id];
    if (o?.featured !== undefined) return { ...item, featured: o.featured };
    return item;
  });
}

function applyExperienceOverrides<T extends { id: string; featured: boolean }>(
  items: T[],
  overrides: ContentOverrides,
): T[] {
  return items.map((item) => {
    const o = overrides.experiences[item.id];
    if (o?.featured !== undefined) return { ...item, featured: o.featured };
    return item;
  });
}

async function loadRooms(): Promise<Room[]> {
  const rooms = await fetchCollection<Room>(COLLECTIONS.ROOMS);
  return rooms.length ? rooms : [...mockRooms];
}

async function loadExperiences(): Promise<Experience[]> {
  const overrides = await loadOverrides();
  const experiences = await fetchCollection<Experience>(COLLECTIONS.EXPERIENCES);
  const data = experiences.length ? experiences : [...mockExperiences];
  return applyExperienceOverrides(data, overrides);
}

async function loadDestinations(): Promise<Destination[]> {
  const overrides = await loadOverrides();
  const destinations = await fetchCollection<Destination>(COLLECTIONS.DESTINATIONS);
  const data = destinations.length ? destinations : getIndexedDestinations();
  return applyDestinationOverrides(data, overrides);
}

export function createFirebaseRoomRepository(): RoomRepository {
  return {
    async getAll() {
      return { data: await loadRooms() };
    },
    async getFeatured() {
      const rooms = await loadRooms();
      return { data: rooms.filter((r) => r.featured) };
    },
    async getById(id) {
      const rooms = await loadRooms();
      return { data: rooms.find((r) => r.id === id) ?? null };
    },
    async getBySlug(slug) {
      const rooms = await loadRooms();
      return { data: rooms.find((r) => r.slug === slug) ?? null };
    },
  };
}

export function createFirebaseExperienceRepository(): ExperienceRepository {
  return {
    async getAll() {
      return { data: await loadExperiences() };
    },
    async getFeatured() {
      const experiences = await loadExperiences();
      return { data: experiences.filter((e) => e.featured) };
    },
    async getById(id) {
      const experiences = await loadExperiences();
      return { data: experiences.find((e) => e.id === id) ?? null };
    },
    async getBySlug(slug) {
      const experiences = await loadExperiences();
      return { data: experiences.find((e) => e.slug === slug) ?? null };
    },
  };
}

export function createFirebaseDestinationRepository(): DestinationRepository {
  return {
    async getAll() {
      return { data: await loadDestinations() };
    },
    async getFeatured() {
      const overrides = await loadOverrides();
      const seeded = await fetchCollection<Destination>(COLLECTIONS.DESTINATIONS);
      const featured = seeded.length
        ? seeded.filter((d) => d.featured)
        : getFeaturedDestinations();
      return { data: applyDestinationOverrides(featured, overrides) };
    },
    async getById(id) {
      const overrides = await loadOverrides();
      const fromDb = await fetchDocument<Destination>(COLLECTIONS.DESTINATIONS, id);
      const item = fromDb ?? getDestinationById(id);
      return { data: item ? applyDestinationOverrides([item], overrides)[0] : null };
    },
    async getBySlug(slug) {
      const overrides = await loadOverrides();
      const destinations = await loadDestinations();
      const fromDb = destinations.find((d) => d.slug === slug);
      const item = fromDb ?? getDestinationBySlug(slug);
      return { data: item ? applyDestinationOverrides([item], overrides)[0] : null };
    },
    async query(query: DestinationQuery = {}) {
      const overrides = await loadOverrides();
      const page = queryDestinations(query);
      return {
        data: {
          ...page,
          items: applyDestinationOverrides(page.items, overrides),
        },
      };
    },
    async getCities() {
      return { data: [...SRI_LANKA_CITIES] };
    },
    async getStats() {
      return { data: getCatalogStats() };
    },
  };
}

export function createFirebaseTestimonialRepository(): TestimonialRepository {
  return {
    async getAll() {
      const testimonials = await fetchCollection<Testimonial>(COLLECTIONS.TESTIMONIALS);
      return { data: testimonials.length ? testimonials : [...mockTestimonials] };
    },
  };
}

export function createFirebaseNewsletterRepository(): NewsletterRepository {
  return {
    async subscribe(email) {
      const id = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
      await upsertDocument(COLLECTIONS.NEWSLETTER, id, {
        email: email.toLowerCase(),
        subscribedAt: new Date().toISOString(),
      });
      return { data: { success: true } };
    },
  };
}

export async function saveContentOverrides(overrides: ContentOverrides) {
  await upsertDocument(COLLECTIONS.CONTENT_OVERRIDES, 'default', overrides);
}

export async function loadContentOverrides(): Promise<ContentOverrides> {
  return loadOverrides();
}
