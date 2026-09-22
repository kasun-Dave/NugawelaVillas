import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useBookingStore } from '@/stores/bookingStore';
import { repositories } from '@/services/repository-registry';
import { RoomCard } from '@/components/booking/RoomCard';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

export function RoomStep() {
  const navigate = useNavigate();
  const { draft, setRoom } = useBookingStore();

  useEffect(() => {
    if (!draft.checkIn || !draft.checkOut) navigate('/booking/dates');
  }, [draft.checkIn, draft.checkOut, navigate]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['rooms', 'booking', draft.checkIn, draft.checkOut, draft.guestCount],
    queryFn: () =>
      repositories.bookings.filterRooms({
        checkIn: draft.checkIn,
        checkOut: draft.checkOut,
        guests: draft.guestCount,
      }),
  });

  const rooms = data?.data ?? [];

  const handleContinue = () => {
    if (draft.roomId) navigate('/booking/add-ons');
  };

  return (
    <div>
      <h2 className="mb-2 font-serif text-2xl font-semibold text-charcoal">Choose your room</h2>
      <p className="text-body mb-6">
        {draft.checkIn} → {draft.checkOut} · {draft.guestCount} guest
        {draft.guestCount !== 1 ? 's' : ''}
      </p>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <p className="text-terracotta">Failed to load available rooms.</p>
      ) : rooms.length === 0 ? (
        <div className="rounded-2xl border border-mist-200 bg-white py-12 text-center">
          <p className="mb-4 text-charcoal-600">No rooms available for these dates.</p>
          <Button variant="outline" onClick={() => navigate('/booking/dates')}>
            Change Dates
          </Button>
        </div>
      ) : (
        <div className="mb-6 space-y-4">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              layout="list"
              showBookButton={false}
              selected={draft.roomId === room.id}
              onSelect={setRoom}
            />
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate('/booking/dates')}>
          Back
        </Button>
        <Button variant="primary" disabled={!draft.roomId} onClick={handleContinue}>
          Continue to Add-ons
        </Button>
      </div>
    </div>
  );
}
