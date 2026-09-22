import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { repositories } from '@/services/repository-registry';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { showToast } from '@/components/ui/toast-utils';
import { cn } from '@/utils/cn';
import type { Notification } from '@/types';

export function NotificationsPage() {
  const user = useAuthStore((s) => s.user);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => repositories.notifications.getForUser(user!.id),
    enabled: !!user,
  });

  const notifications = data?.data ?? [];

  const handleMarkRead = async (id: string) => {
    await repositories.notifications.markRead(id);
    refetch();
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    await repositories.notifications.markAllRead(user.id);
    showToast('All notifications marked as read', 'success');
    refetch();
  };

  const unread = notifications.filter((n) => !n.read);

  return (
    <div className="rounded-2xl border border-mist-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold">Notifications</h2>
        {unread.length > 0 ? (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
        ) : null}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <p className="py-8 text-center text-charcoal-500">No notifications yet.</p>
      ) : (
        <div className="space-y-3" role="list">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onMarkRead={handleMarkRead} />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
}) {
  return (
    <div
      role="listitem"
      className={cn(
        'rounded-xl border p-4 transition-colors',
        notification.read ? 'border-mist-200 bg-white' : 'border-forest/20 bg-forest-50',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs uppercase capitalize tracking-wider text-charcoal-400">
              {notification.type}
            </span>
            {notification.priority === 'high' ? (
              <span className="rounded-full bg-terracotta/10 px-2 py-0.5 text-xs text-terracotta">
                Important
              </span>
            ) : null}
          </div>
          <p className="font-medium text-charcoal">{notification.title}</p>
          <p className="mt-1 text-sm text-charcoal-600">{notification.message}</p>
          <div className="mt-3 flex gap-3">
            {notification.actionUrl ? (
              <Link to={notification.actionUrl} className="text-sm text-forest hover:underline">
                View →
              </Link>
            ) : null}
            {!notification.read ? (
              <button
                type="button"
                onClick={() => onMarkRead(notification.id)}
                className="text-sm text-charcoal-500 hover:text-forest"
              >
                Mark as read
              </button>
            ) : null}
          </div>
        </div>
        {!notification.read ? (
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-forest" aria-label="Unread" />
        ) : null}
      </div>
    </div>
  );
}
