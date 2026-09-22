import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Check, Users, Maximize, Mountain, Calendar } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { ImageWithFallback } from '@/components/ui/shared';
import { AvailabilityCalendar } from '@/components/booking/AvailabilityCalendar';
import { useCalendarDateSelection } from '@/components/booking/calendar-utils';
import { PriceBreakdownCard } from '@/components/booking/PriceBreakdown';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDisplayDate, isValidDateRange } from '@/utils/date';
import { getUnavailableDates } from '@/services/mock-data/availability';

export function RoomDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') ?? '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') ?? '');
  const [guestCount, setGuestCount] = useState(parseInt(searchParams.get('guests') ?? '2', 10));
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  const {
    data: roomData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['room', slug],
    queryFn: () => repositories.rooms.getBySlug(slug!),
    enabled: !!slug,
  });

  const room = roomData?.data;

  const { data: availabilityData } = useQuery({
    queryKey: ['availability', room?.id],
    queryFn: () => repositories.bookings.getAvailability(room!.id),
    enabled: !!room,
  });

  const unavailableDates =
    room && availabilityData?.data ? getUnavailableDates(room.id, availabilityData.data) : [];

  const { data: priceData } = useQuery({
    queryKey: ['price', room?.id, checkIn, checkOut],
    queryFn: () => repositories.bookings.calculatePrice(room!.id, checkIn, checkOut, []),
    enabled: !!room && isValidDateRange(checkIn, checkOut),
  });

  const handleDateSelect = useCalendarDateSelection((ci, co) => {
    setCheckIn(ci);
    setCheckOut(co);
  });

  if (isLoading) {
    return (
      <div className="section-padding container-narrow space-y-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div className="section-padding container-narrow py-16 text-center">
        <h1 className="heading-section mb-4">Room Not Found</h1>
        <p className="text-body mb-6">This room doesn&apos;t exist or has been removed.</p>
        <Button asChild>
          <Link to="/rooms">Browse All Rooms</Link>
        </Button>
      </div>
    );
  }

  const bookUrl = isValidDateRange(checkIn, checkOut)
    ? `/booking/add-ons?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guestCount}&roomId=${room.id}`
    : `/booking/dates?roomId=${room.id}`;

  return (
    <div className="min-h-screen bg-ivory">
      <div className="relative h-64 sm:h-80 lg:h-96">
        <ImageWithFallback src={room.images[0]} alt={room.name} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
        <div className="container-narrow absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <h1 className="font-serif text-3xl font-semibold text-ivory sm:text-4xl">{room.name}</h1>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-ivory/80">
            <span className="flex items-center gap-1 capitalize">
              <Mountain className="h-4 w-4" /> {room.viewType} view
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> Up to {room.maxGuests} guests
            </span>
            <span className="flex items-center gap-1">
              <Maximize className="h-4 w-4" /> {room.sizeSqm} m²
            </span>
          </div>
        </div>
      </div>

      <div className="section-padding container-narrow">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section>
              <h2 className="mb-4 font-serif text-2xl font-semibold text-charcoal">
                About this room
              </h2>
              <p className="text-body leading-relaxed">{room.description}</p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl font-semibold text-charcoal">Amenities</h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {room.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-2 text-sm text-charcoal-600">
                    <Check className="h-4 w-4 shrink-0 text-forest" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl font-semibold text-charcoal">Availability</h2>
              <AvailabilityCalendar
                unavailableDates={unavailableDates}
                selectedCheckIn={checkIn}
                selectedCheckOut={checkOut}
                onSelectDate={(date) => handleDateSelect(date, checkIn, checkOut)}
                month={calendarMonth}
                year={calendarYear}
                onMonthChange={(m, y) => {
                  setCalendarMonth(m);
                  setCalendarYear(y);
                }}
              />
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-24 rounded-2xl border border-mist-200 bg-white p-6">
              <p className="font-serif text-2xl font-semibold text-forest">
                ${room.basePricePerNight}
                <span className="text-sm font-normal text-charcoal-400"> / night</span>
              </p>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-charcoal">Guests</label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                    className="w-full rounded-xl border border-mist-200 px-4 py-2.5 text-sm"
                    aria-label="Number of guests"
                  >
                    {Array.from({ length: room.maxGuests }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {checkIn ? (
                  <div className="space-y-1 text-sm">
                    <p className="flex items-center gap-2 text-charcoal-600">
                      <Calendar className="h-4 w-4" />
                      {formatDisplayDate(checkIn)}
                      {checkOut ? ` → ${formatDisplayDate(checkOut)}` : ' (select check-out)'}
                    </p>
                  </div>
                ) : null}
              </div>

              {priceData?.data ? (
                <div className="mt-4">
                  <PriceBreakdownCard breakdown={priceData.data} compact />
                </div>
              ) : null}

              <Button
                variant="primary"
                className="mt-6 w-full"
                size="lg"
                disabled={!isValidDateRange(checkIn, checkOut)}
                asChild
              >
                <Link to={bookUrl}>
                  {isValidDateRange(checkIn, checkOut)
                    ? 'Continue Booking'
                    : 'Select Dates to Book'}
                </Link>
              </Button>

              <p className="mt-3 text-center text-xs text-charcoal-400">
                Free cancellation up to 48 hours before check-in
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
