import { describe, it, expect, beforeEach } from 'vitest';
import { bookingRepository } from '@/services/repositories/booking-repository';
import { removeStorageItem, STORAGE_KEYS } from '@/utils/storage';

describe('BookingRepository', () => {
  beforeEach(() => {
    removeStorageItem(STORAGE_KEYS.BOOKINGS);
  });

  it('creates a booking with reference code', async () => {
    const result = await bookingRepository.create({
      roomId: 'room-mountain-suite',
      checkIn: '2026-09-01',
      checkOut: '2026-09-04',
      guestCount: 2,
      addOnIds: [],
      guestDetails: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '0771234567',
      },
    });

    expect(result.data.referenceCode).toMatch(/^NEG-/);
    expect(result.data.status).toBe('confirmed');
    expect(result.data.totalPrice).toBeGreaterThan(0);
  });

  it('prevents double booking', async () => {
    const input = {
      roomId: 'room-mountain-suite',
      checkIn: '2026-09-10',
      checkOut: '2026-09-14',
      guestCount: 2,
      addOnIds: [] as string[],
      guestDetails: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '0771234567',
      },
    };

    await bookingRepository.create(input);
    const conflict = await bookingRepository.create({
      ...input,
      checkIn: '2026-09-12',
      checkOut: '2026-09-15',
    });

    expect(conflict.error).toBeDefined();
  });

  it('filters rooms by guest count', async () => {
    const result = await bookingRepository.filterRooms({ guests: 5 });
    expect(result.data.every((r) => r.maxGuests >= 5)).toBe(true);
  });

  it('cancels a booking', async () => {
    const created = await bookingRepository.create({
      roomId: 'room-garden-courtyard',
      checkIn: '2026-10-01',
      checkOut: '2026-10-03',
      guestCount: 2,
      addOnIds: [],
      guestDetails: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '0771234567',
      },
    });

    const cancelled = await bookingRepository.cancel(created.data.id);
    expect(cancelled.data.status).toBe('cancelled');
  });
});
