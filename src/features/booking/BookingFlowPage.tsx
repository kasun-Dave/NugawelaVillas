import { useEffect } from 'react';
import { Routes, Route, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { useBookingStore } from '@/stores/bookingStore';
import { BookingStepper, BookingSummarySidebar } from '@/components/booking/BookingStepper';
import { DatesStep } from './steps/DatesStep';
import { RoomStep } from './steps/RoomStep';
import { AddOnsStep } from './steps/AddOnsStep';
import { GuestDetailsStep } from './steps/GuestDetailsStep';
import { PaymentStep } from './steps/PaymentStep';
import { ConfirmationStep } from './steps/ConfirmationStep';
import { useQuery } from '@tanstack/react-query';
import { repositories } from '@/services/repository-registry';
import { formatDisplayDate } from '@/utils/date';

import type { BookingStep } from '@/stores/bookingStore';

function getStepFromPath(pathname: string): BookingStep {
  if (pathname.includes('confirmation')) return 'confirmation';
  if (pathname.includes('payment')) return 'payment';
  if (pathname.includes('guest')) return 'guest';
  if (pathname.includes('add-ons')) return 'addons';
  if (pathname.includes('room')) return 'room';
  return 'dates';
}

function BookingLayout({ children }: { children: React.ReactNode }) {
  const { draft, initFromSearchParams } = useBookingStore();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    initFromSearchParams({
      checkIn: searchParams.get('checkIn') ?? undefined,
      checkOut: searchParams.get('checkOut') ?? undefined,
      guests: searchParams.get('guests') ?? undefined,
      roomId: searchParams.get('roomId') ?? undefined,
    });
  }, [searchParams, initFromSearchParams]);

  const { data: roomData } = useQuery({
    queryKey: ['room', draft.roomId],
    queryFn: () => repositories.rooms.getById(draft.roomId!),
    enabled: !!draft.roomId,
  });

  const { data: priceData } = useQuery({
    queryKey: ['price', draft.roomId, draft.checkIn, draft.checkOut, draft.addOnIds],
    queryFn: () =>
      repositories.bookings.calculatePrice(
        draft.roomId!,
        draft.checkIn,
        draft.checkOut,
        draft.addOnIds,
      ),
    enabled: !!draft.roomId && !!draft.checkIn && !!draft.checkOut,
  });

  return (
    <div className="section-padding min-h-screen bg-ivory">
      <div className="container-narrow">
        <h1 className="heading-section mb-2">Book Your Stay</h1>
        <p className="text-body mb-8">Complete your reservation in a few simple steps.</p>

        <BookingStepper currentStep={getStepFromPath(location.pathname)} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">{children}</div>
          <div>
            <BookingSummarySidebar
              roomName={roomData?.data?.name}
              checkIn={draft.checkIn ? formatDisplayDate(draft.checkIn) : undefined}
              checkOut={draft.checkOut ? formatDisplayDate(draft.checkOut) : undefined}
              guestCount={draft.guestCount}
              totalPrice={priceData?.data?.total}
              currency={priceData?.data?.currency}
              editLink="/booking/dates"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookingFlowPage() {
  return (
    <Routes>
      <Route index element={<Navigate to="dates" replace />} />
      <Route
        path="dates"
        element={
          <BookingLayout>
            <DatesStep />
          </BookingLayout>
        }
      />
      <Route
        path="room"
        element={
          <BookingLayout>
            <RoomStep />
          </BookingLayout>
        }
      />
      <Route
        path="add-ons"
        element={
          <BookingLayout>
            <AddOnsStep />
          </BookingLayout>
        }
      />
      <Route
        path="guest"
        element={
          <BookingLayout>
            <GuestDetailsStep />
          </BookingLayout>
        }
      />
      <Route
        path="payment"
        element={
          <BookingLayout>
            <PaymentStep />
          </BookingLayout>
        }
      />
      <Route path="confirmation/:reference" element={<ConfirmationStep />} />
    </Routes>
  );
}
