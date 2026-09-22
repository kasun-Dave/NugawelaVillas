import type { AdventureCode } from '@/types/adventure';
import type { AuditLogEntry, AuditActor } from '@/types/audit';
import type {
  AdventureAnalytics,
  GuestProgressSummary,
  AdminBookingSummary,
  AdminBookingRow,
} from '@/types/admin';
import type { BookingStatus, Destination, Experience, RepositoryResult } from '@/types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage';
import { appendAuditLog, getAuditLogs } from '@/utils/audit-log';
import { adventureStages } from '../mock-data/adventure-stages';
import { getPersistedAdventureCodes } from '../mock-data/adventure-codes-store';
import {
  getContentOverrides,
  saveContentOverrides,
  applyDestinationOverrides,
  applyExperienceOverrides,
} from '../mock-data/content-overrides-store';
import { mockRooms } from '../mock-data/rooms';
import { getDestinationById, getIndexedDestinations } from '../mock-data/destinations';
import { mockExperiences } from '../mock-data/experiences';
import { bookingRepository as defaultBookingRepository } from './booking-repository';
import type { BookingRepository } from './booking-repository';

interface StoredUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

function getUsers(): StoredUser[] {
  return getStorageItem<StoredUser[]>(STORAGE_KEYS.USERS, []);
}

function getCodes(): AdventureCode[] {
  return getPersistedAdventureCodes();
}

function saveCodes(codes: AdventureCode[]) {
  setStorageItem(STORAGE_KEYS.ADVENTURE_CODES, codes);
}

function getAllProgress() {
  return getStorageItem<import('@/types/adventure').AdventureProgress[]>(
    STORAGE_KEYS.ADVENTURE_PROGRESS,
    [],
  );
}

export interface AdminRepository {
  getBookingSummary(): Promise<RepositoryResult<AdminBookingSummary>>;
  listBookings(): Promise<RepositoryResult<AdminBookingRow[]>>;
  updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
    actor: AuditActor,
  ): Promise<RepositoryResult<import('@/types').Booking>>;
  cancelBooking(
    bookingId: string,
    actor: AuditActor,
  ): Promise<RepositoryResult<import('@/types').Booking>>;
  getAdventureAnalytics(): Promise<RepositoryResult<AdventureAnalytics>>;
  listGuestProgress(): Promise<RepositoryResult<GuestProgressSummary[]>>;
  listAdventureCodes(): Promise<RepositoryResult<AdventureCode[]>>;
  toggleAdventureCode(
    codeId: string,
    active: boolean,
    actor: AuditActor,
  ): Promise<RepositoryResult<AdventureCode>>;
  resetGuestAdventure(
    userId: string,
    actor: AuditActor,
  ): Promise<RepositoryResult<{ success: boolean }>>;
  listAuditLogs(limit?: number): Promise<RepositoryResult<AuditLogEntry[]>>;
  listDestinationsForAdmin(): Promise<RepositoryResult<Destination[]>>;
  listExperiencesForAdmin(): Promise<RepositoryResult<Experience[]>>;
  toggleDestinationFeatured(
    id: string,
    featured: boolean,
    actor: AuditActor,
  ): Promise<RepositoryResult<Destination>>;
  toggleExperienceFeatured(
    id: string,
    featured: boolean,
    actor: AuditActor,
  ): Promise<RepositoryResult<Experience>>;
}

class LocalAdminRepository implements AdminRepository {
  constructor(private bookings: BookingRepository = defaultBookingRepository) {}
  async getBookingSummary() {
    const bookings = getStorageItem<import('@/types').Booking[]>(STORAGE_KEYS.BOOKINGS, []);
    const now = new Date().toISOString().slice(0, 10);
    const confirmed = bookings.filter((b) => b.status === 'confirmed' || b.status === 'checked_in');
    const upcoming = confirmed.filter((b) => b.checkIn >= now);
    return {
      data: {
        totalBookings: bookings.length,
        confirmedBookings: confirmed.length,
        upcomingBookings: upcoming.length,
      },
    };
  }

  async listBookings() {
    const bookings = getStorageItem<import('@/types').Booking[]>(STORAGE_KEYS.BOOKINGS, []);
    const rows: AdminBookingRow[] = bookings
      .map((b) => {
        const room = mockRooms.find((r) => r.id === b.roomId);
        return {
          id: b.id,
          referenceCode: b.referenceCode,
          guestName: `${b.guestDetails.firstName} ${b.guestDetails.lastName}`,
          guestEmail: b.guestDetails.email,
          roomName: room?.name ?? 'Unknown room',
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          guestCount: b.guestCount,
          status: b.status,
          totalPrice: b.totalPrice,
          currency: b.currency,
          createdAt: b.createdAt,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { data: rows };
  }

  async updateBookingStatus(bookingId: string, status: BookingStatus, actor: AuditActor) {
    const result = await this.bookings.updateStatus(bookingId, status);
    if (result.error) return result;

    appendAuditLog(
      actor,
      status === 'cancelled' ? 'booking.cancelled' : 'booking.status_updated',
      'booking',
      bookingId,
      `Booking ${result.data.referenceCode} status → ${status}`,
      { referenceCode: result.data.referenceCode, status },
    );
    return result;
  }

  async cancelBooking(bookingId: string, actor: AuditActor) {
    return this.updateBookingStatus(bookingId, 'cancelled', actor);
  }

  async getAdventureAnalytics() {
    const progress = getAllProgress();
    const codes = getCodes();
    const totalStages = adventureStages.length;

    let completed = 0;
    let paused = 0;
    let stageSum = 0;

    for (const p of progress) {
      stageSum += p.completedStageIds.length;
      if (p.paused) paused++;
      if (p.completedStageIds.length >= totalStages) completed++;
    }

    const active = progress.length - completed;

    return {
      data: {
        activeAdventures: active,
        completedAdventures: completed,
        pausedAdventures: paused,
        totalGuestsWithProgress: progress.length,
        averageStagesCompleted: progress.length
          ? Math.round((stageSum / progress.length) * 10) / 10
          : 0,
        totalStages,
        activeCodes: codes.filter((c) => c.active).length,
        totalCodes: codes.length,
      },
    };
  }

  async listGuestProgress() {
    const progress = getAllProgress();
    const users = getUsers();
    const totalStages = adventureStages.length;

    const summaries: GuestProgressSummary[] = progress.map((p) => {
      const user = users.find((u) => u.id === p.userId);
      const currentStage = adventureStages.find((s) => s.id === p.currentStageId);
      const completed = p.completedStageIds.length;
      return {
        userId: p.userId,
        guestName: user?.displayName ?? 'Unknown guest',
        email: user?.email ?? '—',
        code: p.code,
        completedStages: completed,
        totalStages,
        artifactCount: p.artifactIds.length,
        paused: p.paused,
        currentStageId: p.currentStageId,
        currentStageTitle: currentStage?.title ?? (completed >= totalStages ? 'Complete' : null),
        startedAt: p.startedAt,
        updatedAt: p.updatedAt,
        isComplete: completed >= totalStages,
      };
    });

    summaries.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return { data: summaries };
  }

  async listAdventureCodes() {
    return { data: getCodes() };
  }

  async toggleAdventureCode(codeId: string, active: boolean, actor: AuditActor) {
    const codes = getCodes();
    const index = codes.findIndex((c) => c.id === codeId);
    if (index === -1) return { data: null as never, error: 'Code not found' };

    codes[index] = { ...codes[index], active };
    saveCodes(codes);

    appendAuditLog(
      actor,
      'adventure.code_toggled',
      'adventure_code',
      codeId,
      `Code ${codes[index].code} ${active ? 'activated' : 'deactivated'}`,
      { code: codes[index].code, active: String(active) },
    );
    return { data: codes[index] };
  }

  async resetGuestAdventure(userId: string, actor: AuditActor) {
    const all = getAllProgress();
    const progress = all.find((p) => p.userId === userId);
    if (!progress) {
      return { data: null as never, error: 'No adventure progress found for this guest' };
    }

    const filtered = all.filter((p) => p.userId !== userId);
    setStorageItem(STORAGE_KEYS.ADVENTURE_PROGRESS, filtered);

    const user = getUsers().find((u) => u.id === userId);
    appendAuditLog(
      actor,
      'adventure.guest_reset',
      'guest',
      userId,
      `Reset adventure for ${user?.displayName ?? userId}`,
      { code: progress.code },
    );
    return { data: { success: true } };
  }

  async listAuditLogs(limit = 50) {
    return { data: getAuditLogs().slice(0, limit) };
  }

  async listDestinationsForAdmin() {
    return { data: applyDestinationOverrides(getIndexedDestinations(12)) };
  }

  async listExperiencesForAdmin() {
    return { data: applyExperienceOverrides([...mockExperiences]) };
  }

  async toggleDestinationFeatured(id: string, featured: boolean, actor: AuditActor) {
    const dest = getDestinationById(id) ?? getIndexedDestinations(12).find((d) => d.id === id);
    if (!dest) return { data: null as never, error: 'Destination not found' };

    const overrides = getContentOverrides();
    overrides.destinations[id] = { featured };
    saveContentOverrides(overrides);

    const updated = { ...dest, featured };
    appendAuditLog(
      actor,
      'content.destination_featured',
      'destination',
      id,
      `${dest.name} featured → ${featured}`,
      { name: dest.name, featured: String(featured) },
    );
    return { data: updated };
  }

  async toggleExperienceFeatured(id: string, featured: boolean, actor: AuditActor) {
    const exp = mockExperiences.find((e) => e.id === id);
    if (!exp) return { data: null as never, error: 'Experience not found' };

    const overrides = getContentOverrides();
    overrides.experiences[id] = { featured };
    saveContentOverrides(overrides);

    const updated = { ...exp, featured };
    appendAuditLog(
      actor,
      'content.experience_featured',
      'experience',
      id,
      `${exp.name} featured → ${featured}`,
      { name: exp.name, featured: String(featured) },
    );
    return { data: updated };
  }
}

export function createLocalAdminRepository(bookings: BookingRepository): AdminRepository {
  return new LocalAdminRepository(bookings);
}

export const adminRepository: AdminRepository =
  createLocalAdminRepository(defaultBookingRepository);
