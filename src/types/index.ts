export type Role =
  | 'resort_admin'
  | 'reception_staff'
  | 'adventure_guide'
  | 'content_manager'
  | 'partner_host'
  | 'guest';

export type Permission =
  | 'bookings:read'
  | 'bookings:write'
  | 'rooms:read'
  | 'rooms:write'
  | 'guests:read'
  | 'adventure:read'
  | 'adventure:write'
  | 'content:read'
  | 'content:write'
  | 'analytics:read'
  | 'admin:access';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface GuestProfile {
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  country?: string;
  preferences: GuestPreferences;
  emergencyContact?: EmergencyContact;
}

export interface GuestPreferences {
  accessibilityMode: boolean;
  newsletterOptIn: boolean;
  adventureHintsEnabled: boolean;
  notificationEmail: boolean;
  notificationPush: boolean;
  interests: string[];
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface Room {
  id: string;
  name: string;
  slug: string;
  type: RoomType;
  description: string;
  shortDescription: string;
  maxGuests: number;
  basePricePerNight: number;
  currency: string;
  viewType: ViewType;
  amenities: string[];
  images: string[];
  featured: boolean;
  sizeSqm: number;
}

export type RoomType = 'suite' | 'chalet' | 'villa' | 'cabin' | 'room';

export type ViewType = 'mountain' | 'forest' | 'garden' | 'valley' | 'courtyard';

export interface RoomAvailability {
  roomId: string;
  date: string;
  available: boolean;
  priceOverride?: number;
}

export interface RoomRate {
  roomId: string;
  seasonLabel: string;
  pricePerNight: number;
  minNights: number;
  validFrom: string;
  validTo: string;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  perNight: boolean;
  category: 'dining' | 'adventure' | 'transport' | 'wellness';
}

export interface Booking {
  id: string;
  referenceCode: string;
  userId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  status: BookingStatus;
  addOnIds: string[];
  totalPrice: number;
  currency: string;
  guestDetails: BookingGuest;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';

export interface BookingGuest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export type AttractionCategory =
  | 'temple'
  | 'viewpoint'
  | 'waterfall'
  | 'tea_estate'
  | 'village'
  | 'trail'
  | 'historic'
  | 'market'
  | 'nature'
  | 'education'
  | 'adventure_stop';

export type PlaceKind = 'famous' | 'hidden_gem';

export type SriLankaProvince =
  | 'Western'
  | 'Central'
  | 'Southern'
  | 'Northern'
  | 'Eastern'
  | 'North Western'
  | 'North Central'
  | 'Uva'
  | 'Sabaragamuwa';

export interface SriLankaCity {
  id: string;
  name: string;
  district: string;
  province: SriLankaProvince;
  lat: number;
  lng: number;
  /** Deterministic hidden-gem slots generated around this city hub. */
  hiddenGemCount: number;
  /** Approx. generation radius from the city hub (km). */
  radiusKm: number;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  distanceKm: number;
  travelTimeMinutes: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  category: AttractionCategory;
  accessibility: string;
  suggestedVisitDuration: string;
  whatToBring: string[];
  safetyNotes: string[];
  culturalContext: string;
  isFictionalStory: boolean;
  images: string[];
  coordinates: { x: number; y: number; lat: number; lng: number };
  featured: boolean;
  cityId: string;
  cityName: string;
  district: string;
  province: SriLankaProvince;
  placeKind: PlaceKind;
}

export interface DestinationQuery {
  cityId?: string;
  province?: SriLankaProvince | '';
  district?: string;
  category?: AttractionCategory | '';
  placeKind?: PlaceKind | '';
  difficulty?: Destination['difficulty'] | '';
  maxDistanceKm?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface DestinationPage {
  items: Destination[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DestinationCatalogStats {
  cityCount: number;
  districtCount: number;
  provinceCount: number;
  famousCount: number;
  hiddenGemCount: number;
  totalPlaces: number;
}

export interface DestinationReview {
  id: string;
  destinationId: string;
  author: string;
  /** 1–5 stars. */
  rating: number;
  comment: string;
  /** ISO date (yyyy-mm-dd) of the visit. */
  visitedOn: string;
  source: 'resort_guest' | 'local' | 'traveller';
}

export interface DestinationReviewSummary {
  destinationId: string;
  averageRating: number;
  reviewCount: number;
}

export interface Experience {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  durationMinutes: number;
  price: number;
  currency: string;
  category: ExperienceCategory;
  maxParticipants: number;
  images: string[];
  featured: boolean;
}

export type ExperienceCategory =
  | 'nature'
  | 'culinary'
  | 'cultural'
  | 'adventure'
  | 'wellness'
  | 'family';

export interface Testimonial {
  id: string;
  guestName: string;
  location: string;
  quote: string;
  rating: number;
  imageUrl: string;
  stayType: string;
}

export interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
}

export interface SearchResult {
  id: string;
  type: 'attraction' | 'region' | 'activity' | 'trail' | 'guide' | 'update' | 'faq';
  title: string;
  description: string;
  url: string;
  score: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

export interface ItineraryItem {
  id: string;
  type: 'destination' | 'experience';
  itemId: string;
  addedAt: string;
  plannedDate?: string;
  notes?: string;
}

export interface Itinerary {
  id: string;
  userId?: string;
  items: ItineraryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'adventure' | 'system' | 'promotion';
  priority: 'low' | 'normal' | 'high';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RepositoryResult<T> {
  data: T;
  error?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
