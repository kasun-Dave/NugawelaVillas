import type {
  Booking,
  BookingGuest,
  Room,
  RoomAvailability,
  AddOn,
  RepositoryResult,
} from '@/types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage';
import {
  generateReferenceCode,
  hasBookingConflict,
  isRoomAvailableForDates,
} from '@/utils/booking';
import { calculatePriceBreakdown } from '@/utils/pricing';
import { mockRooms } from '../mock-data/rooms';
import { mockAddOns } from '../mock-data/add-ons';
import {
  generateMockAvailability,
  getBlockedDatesFromBookings,
  getUnavailableDates,
} from '../mock-data/availability';

export interface CreateBookingInput {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  addOnIds: string[];
  guestDetails: BookingGuest;
  userId?: string;
}

export interface RoomFilters {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  roomType?: string;
  viewType?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
}

export interface BookingRepository {
  getAll(): Promise<RepositoryResult<Booking[]>>;
  getByUserId(userId: string): Promise<RepositoryResult<Booking[]>>;
  getByReference(referenceCode: string): Promise<RepositoryResult<Booking | null>>;
  getById(id: string): Promise<RepositoryResult<Booking | null>>;
  create(input: CreateBookingInput): Promise<RepositoryResult<Booking>>;
  cancel(id: string): Promise<RepositoryResult<Booking>>;
  updateStatus(id: string, status: Booking['status']): Promise<RepositoryResult<Booking>>;
  getAvailability(roomId?: string): Promise<RepositoryResult<RoomAvailability[]>>;
  getAddOns(): Promise<RepositoryResult<AddOn[]>>;
  filterRooms(filters: RoomFilters): Promise<RepositoryResult<Room[]>>;
  checkAvailability(
    roomId: string,
    checkIn: string,
    checkOut: string,
  ): Promise<RepositoryResult<{ available: boolean; reason?: string }>>;
  calculatePrice(
    roomId: string,
    checkIn: string,
    checkOut: string,
    addOnIds: string[],
  ): Promise<RepositoryResult<ReturnType<typeof calculatePriceBreakdown>>>;
}

class LocalBookingRepository implements BookingRepository {
  private getBookings(): Booking[] {
    return getStorageItem<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  }

  private saveBookings(bookings: Booking[]) {
    setStorageItem(STORAGE_KEYS.BOOKINGS, bookings);
  }

  private getAvailabilityData(): RoomAvailability[] {
    const bookings = this.getBookings();
    const blocked = getBlockedDatesFromBookings(bookings);
    return generateMockAvailability(blocked);
  }

  async getAll() {
    return { data: this.getBookings() };
  }

  async getByUserId(userId: string) {
    const bookings = this.getBookings().filter((b) => b.userId === userId);
    return { data: bookings };
  }

  async getByReference(referenceCode: string) {
    const booking = this.getBookings().find((b) => b.referenceCode === referenceCode);
    return { data: booking ?? null };
  }

  async getById(id: string) {
    const booking = this.getBookings().find((b) => b.id === id);
    return { data: booking ?? null };
  }

  async getAvailability(roomId?: string) {
    const all = this.getAvailabilityData();
    const data = roomId ? all.filter((a) => a.roomId === roomId) : all;
    return { data };
  }

  async getAddOns() {
    return { data: [...mockAddOns] };
  }

  async filterRooms(filters: RoomFilters) {
    let rooms = [...mockRooms];

    if (filters.guests) {
      rooms = rooms.filter((r) => r.maxGuests >= filters.guests!);
    }
    if (filters.roomType) {
      rooms = rooms.filter((r) => r.type === filters.roomType);
    }
    if (filters.viewType) {
      rooms = rooms.filter((r) => r.viewType === filters.viewType);
    }
    if (filters.minPrice) {
      rooms = rooms.filter((r) => r.basePricePerNight >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      rooms = rooms.filter((r) => r.basePricePerNight <= filters.maxPrice!);
    }
    if (filters.amenities?.length) {
      rooms = rooms.filter((r) =>
        filters.amenities!.every((a) =>
          r.amenities.some((ra) => ra.toLowerCase().includes(a.toLowerCase())),
        ),
      );
    }

    if (filters.checkIn && filters.checkOut) {
      const bookings = this.getBookings();
      const availability = this.getAvailabilityData();
      rooms = rooms.filter((room) => {
        const blocked = getUnavailableDates(room.id, availability);
        return isRoomAvailableForDates(
          room.id,
          filters.checkIn!,
          filters.checkOut!,
          blocked,
          bookings,
        );
      });
    }

    return { data: rooms };
  }

  async checkAvailability(roomId: string, checkIn: string, checkOut: string) {
    const bookings = this.getBookings();
    const availability = this.getAvailabilityData();
    const blocked = getUnavailableDates(roomId, availability);

    if (hasBookingConflict(roomId, checkIn, checkOut, bookings)) {
      return { data: { available: false, reason: 'Room is already booked for these dates.' } };
    }

    const available = isRoomAvailableForDates(roomId, checkIn, checkOut, blocked, bookings);
    return {
      data: {
        available,
        reason: available ? undefined : 'Some dates in this range are not available.',
      },
    };
  }

  async calculatePrice(roomId: string, checkIn: string, checkOut: string, addOnIds: string[]) {
    const room = mockRooms.find((r) => r.id === roomId);
    if (!room) return { data: null as never, error: 'Room not found' };

    const availability = this.getAvailabilityData();
    const breakdown = calculatePriceBreakdown(
      room,
      checkIn,
      checkOut,
      availability,
      mockAddOns,
      addOnIds,
    );
    return { data: breakdown };
  }

  async create(input: CreateBookingInput) {
    const bookings = this.getBookings();
    const availability = this.getAvailabilityData();
    const blocked = getUnavailableDates(input.roomId, availability);

    if (hasBookingConflict(input.roomId, input.checkIn, input.checkOut, bookings)) {
      return {
        data: null as never,
        error: 'Booking conflict — room unavailable for selected dates.',
      };
    }

    if (!isRoomAvailableForDates(input.roomId, input.checkIn, input.checkOut, blocked, bookings)) {
      return { data: null as never, error: 'Selected dates are not available.' };
    }

    const room = mockRooms.find((r) => r.id === input.roomId);
    if (!room) return { data: null as never, error: 'Room not found' };

    const breakdown = calculatePriceBreakdown(
      room,
      input.checkIn,
      input.checkOut,
      availability,
      mockAddOns,
      input.addOnIds,
    );

    const now = new Date().toISOString();
    const booking: Booking = {
      id: crypto.randomUUID(),
      referenceCode: generateReferenceCode(),
      userId: input.userId ?? 'guest-anonymous',
      roomId: input.roomId,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guestCount: input.guestCount,
      status: 'confirmed',
      addOnIds: input.addOnIds,
      totalPrice: breakdown.total,
      currency: breakdown.currency,
      guestDetails: input.guestDetails,
      createdAt: now,
      updatedAt: now,
    };

    bookings.push(booking);
    this.saveBookings(bookings);
    return { data: booking };
  }

  async cancel(id: string) {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) return { data: null as never, error: 'Booking not found' };

    bookings[index] = {
      ...bookings[index],
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    };
    this.saveBookings(bookings);
    return { data: bookings[index] };
  }

  async updateStatus(id: string, status: Booking['status']) {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) return { data: null as never, error: 'Booking not found' };

    bookings[index] = {
      ...bookings[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    this.saveBookings(bookings);
    return { data: bookings[index] };
  }
}

export function createLocalBookingRepository(): BookingRepository {
  return new LocalBookingRepository();
}

export const bookingRepository: BookingRepository = createLocalBookingRepository();
