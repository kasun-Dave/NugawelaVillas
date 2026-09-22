import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Download, Calendar, MapPin, Mail } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { Button } from '@/components/ui/Button';
import { PriceBreakdownCard } from '@/components/booking/PriceBreakdown';
import { formatDisplayDate } from '@/utils/date';
import { Skeleton } from '@/components/ui/Skeleton';

export function ConfirmationStep() {
  const { reference } = useParams<{ reference: string }>();

  const { data: bookingData, isLoading } = useQuery({
    queryKey: ['booking', reference],
    queryFn: () => repositories.bookings.getByReference(reference!),
    enabled: !!reference,
  });

  const booking = bookingData?.data;

  const { data: roomData } = useQuery({
    queryKey: ['room', booking?.roomId],
    queryFn: () => repositories.rooms.getById(booking!.roomId),
    enabled: !!booking,
  });

  const { data: priceData } = useQuery({
    queryKey: ['price', booking?.roomId, booking?.checkIn, booking?.checkOut, booking?.addOnIds],
    queryFn: () =>
      repositories.bookings.calculatePrice(
        booking!.roomId,
        booking!.checkIn,
        booking!.checkOut,
        booking!.addOnIds,
      ),
    enabled: !!booking,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-4 font-serif text-2xl font-semibold">Booking Not Found</h2>
        <p className="text-body mb-6">We couldn&apos;t find a booking with that reference.</p>
        <Button asChild>
          <Link to="/rooms">Browse Rooms</Link>
        </Button>
      </div>
    );
  }

  const room = roomData?.data;

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <CheckCircle className="h-12 w-12 text-forest" />
        <div>
          <h2 className="font-serif text-2xl font-semibold text-charcoal">Booking Confirmed!</h2>
          <p className="text-charcoal-500">Your escape to Nugawela awaits.</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border-2 border-forest/20 bg-white p-6" id="booking-summary">
        <div className="mb-6 flex items-center justify-between border-b border-mist-200 pb-4">
          <div>
            <p className="text-sm text-charcoal-400">Booking Reference</p>
            <p className="font-mono text-xl font-bold text-forest">{booking.referenceCode}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-charcoal-400">Status</p>
            <span className="inline-flex items-center rounded-full bg-forest-50 px-3 py-1 text-sm font-medium capitalize text-forest">
              {booking.status}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {room ? (
            <div>
              <p className="text-sm text-charcoal-400">Room</p>
              <p className="font-serif text-lg font-semibold">{room.name}</p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 text-forest" />
              <div>
                <p className="text-sm text-charcoal-400">Check-in</p>
                <p className="font-medium">{formatDisplayDate(booking.checkIn)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 text-forest" />
              <div>
                <p className="text-sm text-charcoal-400">Check-out</p>
                <p className="font-medium">{formatDisplayDate(booking.checkOut)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 text-forest" />
            <div>
              <p className="text-sm text-charcoal-400">Guest</p>
              <p className="font-medium">
                {booking.guestDetails.firstName} {booking.guestDetails.lastName}
              </p>
              <p className="text-sm text-charcoal-500">
                {booking.guestCount} guest{booking.guestCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Mail className="mt-0.5 h-4 w-4 text-forest" />
            <div>
              <p className="text-sm text-charcoal-400">Confirmation sent to</p>
              <p className="font-medium">{booking.guestDetails.email}</p>
            </div>
          </div>
        </div>

        {priceData?.data ? (
          <div className="mt-6 border-t border-mist-200 pt-4">
            <PriceBreakdownCard breakdown={priceData.data} compact />
          </div>
        ) : null}
      </div>

      <div className="mb-6 rounded-xl border border-gold/20 bg-gold/10 p-4">
        <p className="text-sm text-charcoal-700">
          <strong>Adventure tip:</strong> At check-in, you&apos;ll receive a welcome card with your
          unique code for <em>The Hidden Trail of Nugawela</em>. Enter it on our website to begin
          your story-driven adventure.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="h-4 w-4" />
          Print Summary
        </Button>
        <Button variant="primary" asChild>
          <Link to="/account/bookings">View My Bookings</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
