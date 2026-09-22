import { useQuery } from '@tanstack/react-query';
import { repositories } from '@/services/repository-registry';
import { Skeleton } from '@/components/ui/Skeleton';
import type { AuditAction } from '@/types/audit';

const ACTION_LABELS: Record<AuditAction, string> = {
  'booking.cancelled': 'Booking cancelled',
  'booking.status_updated': 'Booking updated',
  'adventure.code_toggled': 'Adventure code',
  'adventure.guest_reset': 'Adventure reset',
  'content.destination_featured': 'Destination',
  'content.experience_featured': 'Experience',
};

export function AdminAuditLogPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: () => repositories.admin.listAuditLogs(100),
  });

  const logs = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Audit Log</h2>
        <p className="mt-1 text-sm text-charcoal-500">
          Staff activity trail for bookings, adventure, and content changes.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : logs.length === 0 ? (
        <div className="rounded-2xl border border-mist-200 bg-white p-8 text-center text-charcoal-500">
          No activity recorded yet. Staff actions will appear here.
        </div>
      ) : (
        <div className="divide-y divide-mist-100 rounded-2xl border border-mist-200 bg-white">
          {logs.map((log) => (
            <div key={log.id} className="flex flex-wrap justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-charcoal">{log.summary}</p>
                <p className="mt-1 text-xs text-charcoal-500">
                  {log.actorName} · {log.actorRole.replace('_', ' ')}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="rounded-full bg-forest-50 px-2 py-1 text-xs font-medium text-forest">
                  {ACTION_LABELS[log.action] ?? log.action}
                </span>
                <p className="mt-1 text-xs text-charcoal-400">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
