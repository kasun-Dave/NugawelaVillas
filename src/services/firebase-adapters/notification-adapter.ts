import type { Notification } from '@/types';
import type { NotificationRepository } from '../repositories/notification-repository';
import { COLLECTIONS } from '../firebase/collections';
import { fetchDocument, fetchWhere, upsertDocument } from '../firebase/firestore-helpers';

function seedNotifications(userId: string): Notification[] {
  const now = new Date().toISOString();
  return [
    {
      id: crypto.randomUUID(),
      userId,
      title: 'Welcome to Nugawela',
      message: 'Your account is ready. Explore destinations and save items to your itinerary.',
      type: 'system',
      priority: 'normal',
      read: false,
      createdAt: now,
      actionUrl: '/destinations',
    },
    {
      id: crypto.randomUUID(),
      userId,
      title: 'The Hidden Trail awaits',
      message: 'After check-in, enter your adventure code to begin the scavenger hunt experience.',
      type: 'adventure',
      priority: 'low',
      read: false,
      createdAt: now,
      actionUrl: '/adventure',
    },
  ];
}

export function createFirebaseNotificationRepository(): NotificationRepository {
  return {
    async getForUser(userId) {
      let notifications = await fetchWhere<Notification>(
        COLLECTIONS.NOTIFICATIONS,
        'userId',
        userId,
      );
      if (notifications.length === 0) {
        notifications = seedNotifications(userId);
        for (const n of notifications) {
          await upsertDocument(COLLECTIONS.NOTIFICATIONS, n.id, n);
        }
      }
      return {
        data: notifications.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      };
    },

    async markRead(id) {
      const notification = await fetchDocument<Notification>(COLLECTIONS.NOTIFICATIONS, id);
      if (!notification) return { data: null as never, error: 'Notification not found' };
      const updated = { ...notification, read: true };
      await upsertDocument(COLLECTIONS.NOTIFICATIONS, id, updated);
      return { data: updated };
    },

    async markAllRead(userId) {
      const notifications = await fetchWhere<Notification>(
        COLLECTIONS.NOTIFICATIONS,
        'userId',
        userId,
      );
      for (const n of notifications) {
        if (!n.read) {
          await upsertDocument(COLLECTIONS.NOTIFICATIONS, n.id, { ...n, read: true });
        }
      }
      return { data: undefined as void };
    },

    async getUnreadCount(userId) {
      const result = await this.getForUser(userId);
      return { data: result.data.filter((n) => !n.read).length };
    },
  };
}
