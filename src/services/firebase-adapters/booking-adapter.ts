import type { Booking, Room } from '@/types';
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
import type { BookingRepository, CreateBookingInput } from '../repositories/booking-repository';
import { COLLECTIONS } from '../firebase/collections';
import { fetchCollection, upsertDocument } from '../firebase/firestore-helpers';

async function loadBookings(): Promise<Booking[]> {
  return fetchCollection<Booking>(COLLECTIONS.BOOKINGS);
}

async function saveBooking(booking: Booking) {
  await upsertDocument(COLLECTIONS.BOOKINGS, booking.id, booking);
}

export function createFirebaseBookingRepository(): BookingRepository {
  return {
    async getAll() {
      return { data: await loadBookings() };
    },

    async getByUserId(userId) {
      const bookings = await loadBookings();
      return { data: bookings.filter((b) => b.userId === userId) };
    },

    async getByReference(referenceCode) {
      const bookings = await loadBookings();
      return { data: bookings.find((b) => b.referenceCode === referenceCode) ?? null };
    },

    async getById(id) {
      const bookings = await loadBookings();
      return { data: bookings.find((b) => b.id === id) ?? null };
    },

    async getAvailability(roomId) {
      const bookings = await loadBookings();
      const blocked = getBlockedDatesFromBookings(bookings);
      const all = generateMockAvailability(blocked);
      const data = roomId ? all.filter((a) => a.roomId === roomId) : all;
      return { data };
    },

    async getAddOns() {
      return { data: [...mockAddOns] };
    },

    async filterRooms(filters) {
      let rooms: Room[] = [...mockRooms];
      const bookings = await loadBookings();
      const availability = generateMockAvailability(getBlockedDatesFromBookings(bookings));

      if (filters.guests) rooms = rooms.filter((r) => r.maxGuests >= filters.guests!);
      if (filters.roomType) rooms = rooms.filter((r) => r.type === filters.roomType);
      if (filters.viewType) rooms = rooms.filter((r) => r.viewType === filters.viewType);
      if (filters.minPrice) rooms = rooms.filter((r) => r.basePricePerNight >= filters.minPrice!);
      if (filters.maxPrice) rooms = rooms.filter((r) => r.basePricePerNight <= filters.maxPrice!);
      if (filters.amenities?.length) {
        rooms = rooms.filter((r) =>
          filters.amenities!.every((a) =>
            r.amenities.some((ra) => ra.toLowerCase().includes(a.toLowerCase())),
          ),
        );
      }

      if (filters.checkIn && filters.checkOut) {
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
    },

    async checkAvailability(roomId, checkIn, checkOut) {
      const bookings = await loadBookings();
      const availability = generateMockAvailability(getBlockedDatesFromBookings(bookings));
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
    },

    async calculatePrice(roomId, checkIn, checkOut, addOnIds) {
      const room = mockRooms.find((r) => r.id === roomId);
      if (!room) return { data: null as never, error: 'Room not found' };

      const bookings = await loadBookings();
      const availability = generateMockAvailability(getBlockedDatesFromBookings(bookings));
      const breakdown = calculatePriceBreakdown(
        room,
        checkIn,
        checkOut,
        availability,
        mockAddOns,
        addOnIds,
      );
      return { data: breakdown };
    },

    async create(input: CreateBookingInput) {
      const bookings = await loadBookings();
      const availability = generateMockAvailability(getBlockedDatesFromBookings(bookings));
      const blocked = getUnavailableDates(input.roomId, availability);

      if (hasBookingConflict(input.roomId, input.checkIn, input.checkOut, bookings)) {
        return {
          data: null as never,
          error: 'Booking conflict — room unavailable for selected dates.',
        };
      }

      if (
        !isRoomAvailableForDates(input.roomId, input.checkIn, input.checkOut, blocked, bookings)
      ) {
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

      await saveBooking(booking);
      return { data: booking };
    },

    async cancel(id) {
      const bookings = await loadBookings();
      const booking = bookings.find((b) => b.id === id);
      if (!booking) return { data: null as never, error: 'Booking not found' };

      const updated: Booking = {
        ...booking,
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      };
      await saveBooking(updated);
      return { data: updated };
    },

    async updateStatus(id, status) {
      const bookings = await loadBookings();
      const booking = bookings.find((b) => b.id === id);
      if (!booking) return { data: null as never, error: 'Booking not found' };

      const updated: Booking = {
        ...booking,
        status,
        updatedAt: new Date().toISOString(),
      };
      await saveBooking(updated);
      return { data: updated };
    },
  };
}
