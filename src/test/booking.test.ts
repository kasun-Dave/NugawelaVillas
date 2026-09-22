import { describe, it, expect } from 'vitest';
import {
  datesOverlap,
  hasBookingConflict,
  generateReferenceCode,
  canCancelBooking,
} from '@/utils/booking';
import type { Booking } from '@/types';

const mockBooking: Booking = {
  id: 'b1',
  referenceCode: 'NEG-TEST01',
  userId: 'user-1',
  roomId: 'room-mountain-suite',
  checkIn: '2026-08-01',
  checkOut: '2026-08-05',
  guestCount: 2,
  status: 'confirmed',
  addOnIds: [],
  totalPrice: 1000,
  currency: 'USD',
  guestDetails: {
    firstName: 'Test',
    lastName: 'Guest',
    email: 'test@example.com',
    phone: '1234567890',
  },
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

describe('booking utilities', () => {
  it('detects overlapping dates', () => {
    expect(datesOverlap('2026-08-01', '2026-08-05', '2026-08-03', '2026-08-07')).toBe(true);
    expect(datesOverlap('2026-08-01', '2026-08-05', '2026-08-06', '2026-08-10')).toBe(false);
  });

  it('detects booking conflicts', () => {
    expect(
      hasBookingConflict('room-mountain-suite', '2026-08-02', '2026-08-04', [mockBooking]),
    ).toBe(true);
    expect(
      hasBookingConflict('room-mountain-suite', '2026-08-06', '2026-08-10', [mockBooking]),
    ).toBe(false);
    expect(
      hasBookingConflict('room-forest-chalet', '2026-08-02', '2026-08-04', [mockBooking]),
    ).toBe(false);
  });

  it('generates reference codes with NEG prefix', () => {
    const code = generateReferenceCode();
    expect(code.startsWith('NEG-')).toBe(true);
    expect(code.length).toBe(10);
  });

  it('allows cancellation for future bookings', () => {
    const futureBooking = {
      ...mockBooking,
      checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    expect(canCancelBooking(futureBooking)).toBe(true);
  });
});
