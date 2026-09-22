import type { Repositories } from '../repository-types';
import { createFirebaseAuthRepository } from './auth-adapter';
import { createFirebaseBookingRepository } from './booking-adapter';
import {
  createFirebaseRoomRepository,
  createFirebaseExperienceRepository,
  createFirebaseDestinationRepository,
  createFirebaseTestimonialRepository,
  createFirebaseNewsletterRepository,
} from './content-adapters';
import { createFirebaseAdventureRepository } from './adventure-adapter';
import { createFirebaseNotificationRepository } from './notification-adapter';
import { createFirebaseSearchRepository } from './search-adapter';
import { createFirebaseAdminRepository } from './admin-adapter';
import { createLocalTravelRepository } from '../repositories/travel-repository';

export function createFirebaseRepositories(): Repositories {
  const auth = createFirebaseAuthRepository();
  const bookings = createFirebaseBookingRepository();
  const adventure = createFirebaseAdventureRepository();
  const notifications = createFirebaseNotificationRepository();
  const search = createFirebaseSearchRepository();
  const admin = createFirebaseAdminRepository(bookings);

  return {
    rooms: createFirebaseRoomRepository(),
    experiences: createFirebaseExperienceRepository(),
    destinations: createFirebaseDestinationRepository(),
    testimonials: createFirebaseTestimonialRepository(),
    newsletter: createFirebaseNewsletterRepository(),
    bookings,
    search,
    auth,
    notifications,
    adventure,
    admin,
    travel: createLocalTravelRepository(),
  };
}
