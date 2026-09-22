import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { mockRooms } from '../mock-data/rooms';
import { famousDestinations, mockDestinations } from '../mock-data/destinations';
import { mockExperiences } from '../mock-data/experiences';
import { mockTestimonials } from '../mock-data/testimonials';
import { mockAdventureCodes } from '../mock-data/adventure-meta';
import { COLLECTIONS, META_DOCS } from './collections';
import { fetchDocument, upsertDocument } from './firestore-helpers';
import { getFirebaseAuth } from './config';
import { seedDemoAuthUsers } from '../firebase-adapters/auth-adapter';

const DEMO_ADMIN_EMAIL = 'admin@nugawela.com';
const DEMO_ADMIN_PASSWORD = 'admin123';

export async function seedFirestoreIfEmpty(): Promise<void> {
  const seeded = await fetchDocument<{ version: number }>(COLLECTIONS.META, META_DOCS.SEED);
  if (seeded?.version) return;

  await seedDemoAuthUsers();

  const auth = getFirebaseAuth();
  await signInWithEmailAndPassword(auth, DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD);

  try {
    for (const room of mockRooms) {
      await upsertDocument(COLLECTIONS.ROOMS, room.id, room);
    }
    const seedDestinations = [
      ...famousDestinations,
      ...mockDestinations.filter((d) => !famousDestinations.some((f) => f.id === d.id)),
    ];
    for (const destination of seedDestinations) {
      await upsertDocument(COLLECTIONS.DESTINATIONS, destination.id, destination);
    }
    for (const experience of mockExperiences) {
      await upsertDocument(COLLECTIONS.EXPERIENCES, experience.id, experience);
    }
    for (const testimonial of mockTestimonials) {
      await upsertDocument(COLLECTIONS.TESTIMONIALS, testimonial.id, testimonial);
    }
    for (const code of mockAdventureCodes) {
      await upsertDocument(COLLECTIONS.ADVENTURE_CODES, code.id, code);
    }

    await upsertDocument(COLLECTIONS.CONTENT_OVERRIDES, 'default', {
      destinations: {},
      experiences: {},
    });

    await upsertDocument(COLLECTIONS.META, META_DOCS.SEED, {
      version: 1,
      seededAt: new Date().toISOString(),
    });
  } finally {
    await signOut(auth);
  }
}
