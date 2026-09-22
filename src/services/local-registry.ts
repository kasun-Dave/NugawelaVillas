import { createLocalAuthRepository } from './repositories/auth-repository';
import { createLocalBookingRepository } from './repositories/booking-repository';
import {
  createLocalRoomRepository,
  createLocalExperienceRepository,
  createLocalDestinationRepository,
  createLocalTestimonialRepository,
  createLocalNewsletterRepository,
} from './repositories/content-repositories';
import { createLocalAdventureRepository } from './repositories/adventure-repository';
import { createLocalNotificationRepository } from './repositories/notification-repository';
import { createLocalSearchRepository } from './repositories/search-repository';
import { createLocalAdminRepository } from './repositories/admin-repository';
import { createLocalTravelRepository } from './repositories/travel-repository';
import type { Repositories } from './repository-types';

export function createLocalRepositories(): Repositories {
  const auth = createLocalAuthRepository();
  const bookings = createLocalBookingRepository();
  const adventure = createLocalAdventureRepository();
  const notifications = createLocalNotificationRepository();
  const search = createLocalSearchRepository();
  const admin = createLocalAdminRepository(bookings);

  return {
    rooms: createLocalRoomRepository(),
    experiences: createLocalExperienceRepository(),
    destinations: createLocalDestinationRepository(),
    testimonials: createLocalTestimonialRepository(),
    newsletter: createLocalNewsletterRepository(),
    bookings,
    search,
    auth,
    notifications,
    adventure,
    admin,
    travel: createLocalTravelRepository(),
  };
}
