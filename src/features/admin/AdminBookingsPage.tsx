import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { repositories } from '@/services/repository-registry';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { showToast } from '@/components/ui/toast-utils';
import type { BookingStatus } from '@/types';

const STATUS_OPTIONS: BookingStatus[] = ['confirmed', 'checked_in', 'completed', 'cancelled'];

export function AdminBookingsPage() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => repositories.admin.listBookings(),
  });

  const bookings = data?.data ?? [];
  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const actor = user ? { id: user.id, name: user.displayName, role: user.role } : null;

  const handleStatus = async (bookingId: string, status: BookingStatus) => {
    if (!actor) return;
    const result = await repositories.admin.updateBookingStatus(bookingId, status, actor);
    if (result.error) {
      showToast(result.error, 'error');
      return;
    }
    showToast(`Booking updated to ${status}`, 'success');
    queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
    queryClient.invalidateQueries({ queryKey: ['admin-booking-summary'] });
    queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Booking Management</h2>
        <p className="mt-1 text-sm text-charcoal-500">
          View reservations, check guests in, and manage cancellations.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', ...STATUS_OPTIONS] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === s ? 'bg-forest text-ivory' : 'bg-mist text-charcoal-600 hover:bg-mist-200'
            }`}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-mist-200 bg-white p-8 text-center text-charcoal-500">
          No bookings match this filter.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-mist/50 text-charcoal-500">
              <tr>
                <th className="px-4 py-3 text-left">Reference</th>
                <th className="px-4 py-3 text-left">Guest</th>
                <th className="px-4 py-3 text-left">Room</th>
                <th className="px-4 py-3 text-left">Dates</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-t border-mist-100">
                  <td className="px-4 py-3 font-mono text-xs text-forest">{b.referenceCode}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{b.guestName}</p>
                    <p className="text-xs text-charcoal-400">{b.guestEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-charcoal-600">{b.roomName}</td>
                  <td className="px-4 py-3 text-xs text-charcoal-600">
                    {b.checkIn} → {b.checkOut}
                    <br />
                    {b.guestCount} guest{b.guestCount !== 1 ? 's' : ''}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {b.currency} {b.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-1">
                      {b.status === 'confirmed' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatus(b.id, 'checked_in')}
                        >
                          Check in
                        </Button>
                      ) : null}
                      {b.status === 'checked_in' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatus(b.id, 'completed')}
                        >
                          Complete
                        </Button>
                      ) : null}
                      {b.status !== 'cancelled' && b.status !== 'completed' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatus(b.id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    pending: 'bg-mist text-charcoal-600',
    confirmed: 'bg-forest-50 text-forest',
    checked_in: 'bg-gold/15 text-gold-700',
    completed: 'bg-mist text-charcoal-500',
    cancelled: 'bg-terracotta/10 text-terracotta',
  };
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
