import type { RoomAvailability } from '@/types';
import { mockRooms } from './rooms';
import { addDays, todayString } from '@/utils/date';

/** Generate mock availability for the next 90 days with occasional blocked dates */
export function generateMockAvailability(
  existingBlockedDates: Record<string, string[]> = {},
): RoomAvailability[] {
  const availability: RoomAvailability[] = [];
  const today = todayString();

  for (const room of mockRooms) {
    const blocked = existingBlockedDates[room.id] ?? [];
    for (let i = 0; i < 90; i++) {
      const date = addDays(today, i);
      const isBlocked = blocked.includes(date);
      // Simulate occasional maintenance blocks (deterministic based on date hash)
      const dayNum = parseInt(date.replace(/-/g, ''), 10);
      const maintenanceBlock = dayNum % 17 === 0 && room.id === 'room-stargazer-cabin';

      availability.push({
        roomId: room.id,
        date,
        available: !isBlocked && !maintenanceBlock,
        priceOverride: i >= 60 ? Math.round(room.basePricePerNight * 1.15) : undefined,
      });
    }
  }

  return availability;
}

export function getBlockedDatesFromBookings(
  bookings: Array<{ roomId: string; checkIn: string; checkOut: string; status: string }>,
): Record<string, string[]> {
  const blocked: Record<string, string[]> = {};
  const activeStatuses = ['pending', 'confirmed', 'checked_in'];

  for (const b of bookings) {
    if (!activeStatuses.includes(b.status)) continue;
    if (!blocked[b.roomId]) blocked[b.roomId] = [];
    let current = b.checkIn;
    while (current < b.checkOut) {
      blocked[b.roomId].push(current);
      current = addDays(current, 1);
    }
  }

  return blocked;
}

export function getAvailabilityForRoom(
  roomId: string,
  allAvailability: RoomAvailability[],
  month: number,
  year: number,
): RoomAvailability[] {
  return allAvailability.filter((a) => {
    if (a.roomId !== roomId) return false;
    const d = new Date(a.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
}

export function getUnavailableDates(roomId: string, allAvailability: RoomAvailability[]): string[] {
  return allAvailability.filter((a) => a.roomId === roomId && !a.available).map((a) => a.date);
}
