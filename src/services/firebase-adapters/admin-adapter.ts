import type { AdventureCode } from '@/types/adventure';
import type { AuditLogEntry, AuditActor } from '@/types/audit';
import type { GuestProgressSummary, AdminBookingRow } from '@/types/admin';
import type { Destination, Experience, User } from '@/types';
import { adventureStages } from '../mock-data/adventure-stages';
import { mockRooms } from '../mock-data/rooms';
import { getDestinationById, getIndexedDestinations } from '../mock-data/destinations';
import { mockExperiences } from '../mock-data/experiences';
import type { AdminRepository } from '../repositories/admin-repository';
import type { BookingRepository } from '../repositories/booking-repository';
import { COLLECTIONS } from '../firebase/collections';
import { fetchCollection, upsertDocument } from '../firebase/firestore-helpers';
import { loadContentOverrides, saveContentOverrides } from './content-adapters';
import {
  listAllAdventureProgress,
  listAdventureCodes,
  saveAdventureCode,
  deleteAdventureProgress,
} from './adventure-adapter';

async function appendFirebaseAuditLog(
  actor: AuditActor,
  action: AuditLogEntry['action'],
  targetType: string,
  targetId: string,
  summary: string,
  metadata?: Record<string, string>,
) {
  const entry: AuditLogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    targetType,
    targetId,
    summary,
    metadata,
  };
  await upsertDocument(COLLECTIONS.AUDIT_LOGS, entry.id, entry);
}

async function loadUsers(): Promise<User[]> {
  return fetchCollection<User>(COLLECTIONS.USERS);
}

export function createFirebaseAdminRepository(bookings: BookingRepository): AdminRepository {
  return {
    async getBookingSummary() {
      const result = await bookings.getAll();
      const bookingsList = result.data;
      const now = new Date().toISOString().slice(0, 10);
      const confirmed = bookingsList.filter(
        (b) => b.status === 'confirmed' || b.status === 'checked_in',
      );
      const upcoming = confirmed.filter((b) => b.checkIn >= now);
      return {
        data: {
          totalBookings: bookingsList.length,
          confirmedBookings: confirmed.length,
          upcomingBookings: upcoming.length,
        },
      };
    },

    async listBookings() {
      const result = await bookings.getAll();
      const rows: AdminBookingRow[] = result.data
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
    },

    async updateBookingStatus(bookingId, status, actor) {
      const result = await bookings.updateStatus(bookingId, status);
      if (result.error) return result;

      await appendFirebaseAuditLog(
        actor,
        status === 'cancelled' ? 'booking.cancelled' : 'booking.status_updated',
        'booking',
        bookingId,
        `Booking ${result.data.referenceCode} status → ${status}`,
        { referenceCode: result.data.referenceCode, status },
      );
      return result;
    },

    async cancelBooking(bookingId, actor) {
      return this.updateBookingStatus(bookingId, 'cancelled', actor);
    },

    async getAdventureAnalytics() {
      const progress = await listAllAdventureProgress();
      const codes = await listAdventureCodes();
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
    },

    async listGuestProgress() {
      const progress = await listAllAdventureProgress();
      const users = await loadUsers();
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
    },

    async listAdventureCodes() {
      return { data: await listAdventureCodes() };
    },

    async toggleAdventureCode(codeId, active, actor) {
      const codes = await listAdventureCodes();
      const code = codes.find((c) => c.id === codeId);
      if (!code) return { data: null as never, error: 'Code not found' };

      const updated: AdventureCode = { ...code, active };
      await saveAdventureCode(updated);

      await appendFirebaseAuditLog(
        actor,
        'adventure.code_toggled',
        'adventure_code',
        codeId,
        `Code ${updated.code} ${active ? 'activated' : 'deactivated'}`,
        { code: updated.code, active: String(active) },
      );
      return { data: updated };
    },

    async resetGuestAdventure(userId, actor) {
      const progress = await listAllAdventureProgress();
      const guestProgress = progress.find((p) => p.userId === userId);
      if (!guestProgress) {
        return { data: null as never, error: 'No adventure progress found for this guest' };
      }

      await deleteAdventureProgress(userId);
      const users = await loadUsers();
      const user = users.find((u) => u.id === userId);

      await appendFirebaseAuditLog(
        actor,
        'adventure.guest_reset',
        'guest',
        userId,
        `Reset adventure for ${user?.displayName ?? userId}`,
        { code: guestProgress.code },
      );
      return { data: { success: true } };
    },

    async listAuditLogs(limit = 50) {
      const logs = await fetchCollection<AuditLogEntry>(COLLECTIONS.AUDIT_LOGS);
      logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      return { data: logs.slice(0, limit) };
    },

    async listDestinationsForAdmin() {
      const overrides = await loadContentOverrides();
      const destinations = getIndexedDestinations(12).map((item) => {
        const o = overrides.destinations[item.id];
        if (o?.featured !== undefined) return { ...item, featured: o.featured };
        return item;
      });
      return { data: destinations };
    },

    async listExperiencesForAdmin() {
      const overrides = await loadContentOverrides();
      const experiences = [...mockExperiences].map((item) => {
        const o = overrides.experiences[item.id];
        if (o?.featured !== undefined) return { ...item, featured: o.featured };
        return item;
      });
      return { data: experiences };
    },

    async toggleDestinationFeatured(id, featured, actor) {
      const dest = getDestinationById(id) ?? getIndexedDestinations(12).find((d) => d.id === id);
      if (!dest) return { data: null as never, error: 'Destination not found' };

      const overrides = await loadContentOverrides();
      overrides.destinations[id] = { featured };
      await saveContentOverrides(overrides);

      const updated: Destination = { ...dest, featured };
      await appendFirebaseAuditLog(
        actor,
        'content.destination_featured',
        'destination',
        id,
        `${dest.name} featured → ${featured}`,
        { name: dest.name, featured: String(featured) },
      );
      return { data: updated };
    },

    async toggleExperienceFeatured(id, featured, actor) {
      const exp = mockExperiences.find((e) => e.id === id);
      if (!exp) return { data: null as never, error: 'Experience not found' };

      const overrides = await loadContentOverrides();
      overrides.experiences[id] = { featured };
      await saveContentOverrides(overrides);

      const updated: Experience = { ...exp, featured };
      await appendFirebaseAuditLog(
        actor,
        'content.experience_featured',
        'experience',
        id,
        `${exp.name} featured → ${featured}`,
        { name: exp.name, featured: String(featured) },
      );
      return { data: updated };
    },
  };
}
