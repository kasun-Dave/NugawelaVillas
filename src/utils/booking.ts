import type { Booking, BookingStatus } from '@/types';
import { eachNight, parseDate } from './date';

export function datesOverlap(
  checkInA: string,
  checkOutA: string,
  checkInB: string,
  checkOutB: string,
): boolean {
  return checkInA < checkOutB && checkOutA > checkInB;
}

export function hasBookingConflict(
  roomId: string,
  checkIn: string,
  checkOut: string,
  existingBookings: Booking[],
  excludeBookingId?: string,
): boolean {
  const activeStatuses: BookingStatus[] = ['pending', 'confirmed', 'checked_in'];

  return existingBookings.some((b) => {
    if (b.roomId !== roomId) return false;
    if (excludeBookingId && b.id === excludeBookingId) return false;
    if (!activeStatuses.includes(b.status)) return false;
    return datesOverlap(checkIn, checkOut, b.checkIn, b.checkOut);
  });
}

export function generateReferenceCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'NEG-';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function isRoomAvailableForDates(
  roomId: string,
  checkIn: string,
  checkOut: string,
  blockedDates: string[],
  existingBookings: Booking[],
): boolean {
  if (hasBookingConflict(roomId, checkIn, checkOut, existingBookings)) {
    return false;
  }

  const nights = eachNight(checkIn, checkOut);
  return nights.every((date) => !blockedDates.includes(date));
}

export function getUpcomingBookings(bookings: Booking[]): Booking[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookings
    .filter((b) => b.status !== 'cancelled' && parseDate(b.checkOut) >= today)
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
}

export function getPastBookings(bookings: Booking[]): Booking[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookings
    .filter((b) => parseDate(b.checkOut) < today || b.status === 'completed')
    .sort((a, b) => b.checkIn.localeCompare(a.checkIn));
}

export function canCancelBooking(booking: Booking): boolean {
  if (booking.status === 'cancelled' || booking.status === 'completed') return false;
  const checkIn = parseDate(booking.checkIn);
  const now = new Date();
  const daysUntil = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return daysUntil >= 2;
}

export function canRescheduleBooking(booking: Booking): boolean {
  return canCancelBooking(booking) && booking.status === 'confirmed';
}
