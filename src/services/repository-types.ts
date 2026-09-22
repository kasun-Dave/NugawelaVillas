import type { AuthRepository } from './repositories/auth-repository';
import type { BookingRepository } from './repositories/booking-repository';
import type {
  RoomRepository,
  ExperienceRepository,
  DestinationRepository,
  TestimonialRepository,
  NewsletterRepository,
} from './repositories/content-repositories';
import type { AdventureRepository } from './repositories/adventure-repository';
import type { NotificationRepository } from './repositories/notification-repository';
import type { SearchRepository } from './repositories/search-repository';
import type { AdminRepository } from './repositories/admin-repository';
import type { TravelRepository } from './repositories/travel-repository';

export interface Repositories {
  rooms: RoomRepository;
  experiences: ExperienceRepository;
  destinations: DestinationRepository;
  testimonials: TestimonialRepository;
  newsletter: NewsletterRepository;
  bookings: BookingRepository;
  search: SearchRepository;
  auth: AuthRepository;
  notifications: NotificationRepository;
  adventure: AdventureRepository;
  admin: AdminRepository;
  travel: TravelRepository;
}
