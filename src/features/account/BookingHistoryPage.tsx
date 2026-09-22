import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, XCircle, RefreshCw } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { showToast } from '@/components/ui/toast-utils';
import { formatDisplayDate } from '@/utils/date';
import {
  canCancelBooking,
  canRescheduleBooking,
  getPastBookings,
  getUpcomingBookings,
} from '@/utils/booking';
import type { Booking } from '@/types';

export function BookingHistoryPage() {
  const user = useAuthStore((s) => s.user);
  const [guestEmail, setGuestEmail] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['bookings', user?.id, lookupEmail],
    queryFn: async () => {
      if (user?.id) {
        return repositories.bookings.getByUserId(user.id);
      }
      const all = await repositories.bookings.getAll();
      if (lookupEmail) {
        const filtered = all.data.filter(
          (b) => b.guestDetails.email.toLowerCase() === lookupEmail.toLowerCase(),
        );
        return { data: filtered };
      }
      return all;
    },
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const bookings = data?.data ?? [];
  const upcoming = getUpcomingBookings(bookings);
  const past = getPastBookings(bookings);

  const handleCancel = async (booking: Booking) => {
    if (!canCancelBooking(booking)) {
      showToast('This booking cannot be cancelled (within 48 hours of check-in).', 'error');
      return;
    }
    const result = await repositories.bookings.cancel(booking.id);
    if (result.error) {
      showToast(result.error, 'error');
    } else {
      showToast('Booking cancelled successfully.', 'success');
      refetch();
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="heading-section mb-2">My Bookings</h1>
      <p className="text-body mb-8">Manage your stays at Nugawela Escape Resort.</p>

      {!user ? (
        <div className="mb-8 rounded-2xl border border-mist-200 bg-white p-6">
          <p className="mb-4 text-sm text-charcoal-600">
            Enter your email to find bookings, or{' '}
            <Link to="/login" className="text-forest hover:underline">
              sign in
            </Link>{' '}
            for full access.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Email used for booking"
              className="flex-1 rounded-xl border border-mist-200 px-4 py-2.5 text-sm"
            />
            <Button onClick={() => setLookupEmail(guestEmail)}>Find Bookings</Button>
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-mist-200 bg-white py-16 text-center">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-charcoal-300" />
          <p className="mb-2 text-charcoal-600">No bookings found.</p>
          <p className="mb-6 text-sm text-charcoal-400">Ready to plan your escape?</p>
          <Button asChild>
            <Link to="/rooms">Browse Rooms</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 ? (
            <section>
              <h2 className="mb-4 font-serif text-xl font-semibold">Upcoming Stays</h2>
              <div className="space-y-4">
                {upcoming.map((b) => (
                  <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
                ))}
              </div>
            </section>
          ) : null}

          {past.length > 0 ? (
            <section>
              <h2 className="mb-4 font-serif text-xl font-semibold">Past Stays</h2>
              <div className="space-y-4">
                {past.map((b) => (
                  <BookingCard key={b.id} booking={b} onCancel={handleCancel} isPast />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}

function BookingCard({
  booking,
  onCancel,
  isPast,
}: {
  booking: Booking;
  onCancel: (b: Booking) => void;
  isPast?: boolean;
}) {
  const canCancel = canCancelBooking(booking);
  const canReschedule = canRescheduleBooking(booking);

  return (
    <div className="rounded-2xl border border-mist-200 bg-white p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-forest">{booking.referenceCode}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs capitalize ${
                booking.status === 'cancelled'
                  ? 'bg-terracotta/10 text-terracotta'
                  : booking.status === 'confirmed'
                    ? 'bg-forest-50 text-forest'
                    : 'bg-mist text-charcoal-600'
              }`}
            >
              {booking.status}
            </span>
          </div>
          <p className="font-medium text-charcoal">
            {formatDisplayDate(booking.checkIn)} → {formatDisplayDate(booking.checkOut)}
          </p>
          <p className="mt-1 text-sm text-charcoal-500">
            {booking.guestCount} guest{booking.guestCount !== 1 ? 's' : ''} · $
            {booking.totalPrice.toFixed(2)}
          </p>
        </div>

        {!isPast && booking.status !== 'cancelled' ? (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/booking/confirmation/${booking.referenceCode}`}>View Details</Link>
            </Button>
            {canReschedule ? (
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/booking/dates?reschedule=${booking.id}`}>
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reschedule
                </Link>
              </Button>
            ) : null}
            {canCancel ? (
              <Button variant="ghost" size="sm" onClick={() => onCancel(booking)}>
                <XCircle className="h-3.5 w-3.5" />
                Cancel
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      {!canCancel && !isPast && booking.status === 'confirmed' ? (
        <p className="mt-3 text-xs text-charcoal-400">
          Cancellation not available within 48 hours of check-in. Contact reception for assistance.
        </p>
      ) : null}
    </div>
  );
}
