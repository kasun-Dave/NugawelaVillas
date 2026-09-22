import type { Notification, RepositoryResult } from '@/types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage';

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

export interface NotificationRepository {
  getForUser(userId: string): Promise<RepositoryResult<Notification[]>>;
  markRead(id: string): Promise<RepositoryResult<Notification>>;
  markAllRead(userId: string): Promise<RepositoryResult<void>>;
  getUnreadCount(userId: string): Promise<RepositoryResult<number>>;
}

class LocalNotificationRepository implements NotificationRepository {
  private getAll(): Notification[] {
    return getStorageItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  }

  private save(notifications: Notification[]) {
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  async getForUser(userId: string) {
    let all = this.getAll();
    const userNotifs = all.filter((n) => n.userId === userId);
    if (userNotifs.length === 0) {
      const seeded = seedNotifications(userId);
      all = [...all, ...seeded];
      this.save(all);
      return { data: seeded };
    }
    return { data: userNotifs.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) };
  }

  async markRead(id: string) {
    const all = this.getAll();
    const index = all.findIndex((n) => n.id === id);
    if (index === -1) return { data: null as never, error: 'Notification not found' };
    all[index] = { ...all[index], read: true };
    this.save(all);
    return { data: all[index] };
  }

  async markAllRead(userId: string) {
    const all = this.getAll();
    const updated = all.map((n) => (n.userId === userId ? { ...n, read: true } : n));
    this.save(updated);
    return { data: undefined as void };
  }

  async getUnreadCount(userId: string) {
    const result = await this.getForUser(userId);
    const count = result.data.filter((n) => !n.read).length;
    return { data: count };
  }
}

export function createLocalNotificationRepository(): NotificationRepository {
  return new LocalNotificationRepository();
}

export const notificationRepository: NotificationRepository = createLocalNotificationRepository();
