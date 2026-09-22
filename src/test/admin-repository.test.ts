import { describe, it, expect, beforeEach } from 'vitest';
import { adminRepository } from '@/services/repositories/admin-repository';
import { adventureRepository } from '@/services/repositories/adventure-repository';
import { bookingRepository } from '@/services/repositories/booking-repository';
import { removeStorageItem, STORAGE_KEYS } from '@/utils/storage';
import { getAuditLogs } from '@/utils/audit-log';

const USER_ID = 'admin-test-guest';
const ACTOR = { id: 'user-demo-admin', name: 'Resort Admin', role: 'resort_admin' };

describe('AdminRepository', () => {
  beforeEach(() => {
    removeStorageItem(STORAGE_KEYS.ADVENTURE_PROGRESS);
    removeStorageItem(STORAGE_KEYS.ADVENTURE_CODES);
    removeStorageItem(STORAGE_KEYS.BOOKINGS);
    removeStorageItem(STORAGE_KEYS.AUDIT_LOGS);
    removeStorageItem(STORAGE_KEYS.CONTENT_OVERRIDES);
  });

  it('returns adventure analytics', async () => {
    await adventureRepository.startAdventure(USER_ID, 'NEG-TRAIL01');
    const result = await adminRepository.getAdventureAnalytics();
    expect(result.data.totalGuestsWithProgress).toBe(1);
    expect(result.data.totalStages).toBe(12);
  });

  it('lists guest progress with user details', async () => {
    await adventureRepository.startAdventure(USER_ID, 'NEG-TRAIL01');
    const result = await adminRepository.listGuestProgress();
    expect(result.data.length).toBe(1);
    expect(result.data[0].code).toBe('NEG-TRAIL01');
  });

  it('toggles adventure code and logs audit', async () => {
    const codes = await adminRepository.listAdventureCodes();
    const code = codes.data[0];
    const toggled = await adminRepository.toggleAdventureCode(code.id, false, ACTOR);
    expect(toggled.data.active).toBe(false);

    const validation = await adventureRepository.validateCode(code.code);
    expect(validation.data.valid).toBe(false);

    const logs = getAuditLogs();
    expect(logs.some((l) => l.action === 'adventure.code_toggled')).toBe(true);
  });

  it('resets guest adventure and logs audit', async () => {
    await adventureRepository.startAdventure(USER_ID, 'NEG-TRAIL01');
    const reset = await adminRepository.resetGuestAdventure(USER_ID, ACTOR);
    expect(reset.data.success).toBe(true);

    const list = await adminRepository.listGuestProgress();
    expect(list.data.length).toBe(0);
    expect(getAuditLogs().some((l) => l.action === 'adventure.guest_reset')).toBe(true);
  });

  it('lists bookings with room names', async () => {
    await bookingRepository.create({
      roomId: 'room-mountain-suite',
      checkIn: '2026-10-01',
      checkOut: '2026-10-04',
      guestCount: 2,
      addOnIds: [],
      guestDetails: {
        firstName: 'Test',
        lastName: 'Guest',
        email: 'test@example.com',
        phone: '0771234567',
      },
    });

    const result = await adminRepository.listBookings();
    expect(result.data.length).toBe(1);
    expect(result.data[0].roomName).toBeTruthy();
  });

  it('updates booking status with audit trail', async () => {
    const created = await bookingRepository.create({
      roomId: 'room-mountain-suite',
      checkIn: '2026-11-01',
      checkOut: '2026-11-03',
      guestCount: 2,
      addOnIds: [],
      guestDetails: {
        firstName: 'Audit',
        lastName: 'Test',
        email: 'audit@example.com',
        phone: '0771234567',
      },
    });

    const updated = await adminRepository.updateBookingStatus(created.data.id, 'checked_in', ACTOR);
    expect(updated.data.status).toBe('checked_in');
    expect(getAuditLogs().some((l) => l.action === 'booking.status_updated')).toBe(true);
  });

  it('toggles destination featured flag', async () => {
    const dests = await adminRepository.listDestinationsForAdmin();
    const dest = dests.data[0];
    const toggled = await adminRepository.toggleDestinationFeatured(dest.id, true, ACTOR);
    expect(toggled.data.featured).toBe(true);

    const refreshed = await adminRepository.listDestinationsForAdmin();
    expect(refreshed.data.find((d) => d.id === dest.id)?.featured).toBe(true);
  });
});
