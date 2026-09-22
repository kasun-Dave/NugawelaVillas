import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, X } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { RoomCard } from '@/components/booking/RoomCard';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { RoomType, ViewType } from '@/types';

const ROOM_TYPES: RoomType[] = ['suite', 'chalet', 'villa', 'cabin', 'room'];
const VIEW_TYPES: ViewType[] = ['mountain', 'forest', 'garden', 'valley', 'courtyard'];

export function RoomsListingPage() {
  const [searchParams] = useSearchParams();
  const checkIn = searchParams.get('checkIn') ?? '';
  const checkOut = searchParams.get('checkOut') ?? '';
  const guests = searchParams.get('guests') ? parseInt(searchParams.get('guests')!, 10) : undefined;

  const [showFilters, setShowFilters] = useState(false);
  const [roomType, setRoomType] = useState('');
  const [viewType, setViewType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [guestFilter, setGuestFilter] = useState(guests?.toString() ?? '');

  const filters = useMemo(
    () => ({
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      guests: guestFilter ? parseInt(guestFilter, 10) : guests,
      roomType: roomType || undefined,
      viewType: viewType || undefined,
      minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
    }),
    [checkIn, checkOut, guests, guestFilter, roomType, viewType, minPrice, maxPrice],
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['rooms', 'filtered', filters],
    queryFn: () => repositories.bookings.filterRooms(filters),
  });

  const rooms = data?.data ?? [];
  const hasActiveFilters = roomType || viewType || minPrice || maxPrice || guestFilter;

  const clearFilters = () => {
    setRoomType('');
    setViewType('');
    setMinPrice('');
    setMaxPrice('');
    setGuestFilter('');
  };

  return (
    <div className="section-padding min-h-screen bg-ivory">
      <div className="container-narrow">
        <div className="mb-8">
          <h1 className="heading-section">Rooms & Stays</h1>
          <p className="text-body mt-2 max-w-2xl">
            Handcrafted spaces across the resort — from mountain-view suites to secluded forest
            chalets.
          </p>
          {checkIn && checkOut ? (
            <p className="mt-2 text-sm font-medium text-forest">
              Showing availability for {checkIn} → {checkOut}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside
            className={`shrink-0 lg:w-72 ${showFilters ? 'block' : 'hidden lg:block'}`}
            aria-label="Room filters"
          >
            <div className="sticky top-24 rounded-2xl border border-mist-200 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-serif text-lg font-semibold">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </h2>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm text-terracotta hover:underline"
                  >
                    Clear all
                  </button>
                ) : null}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal">Guests</label>
                  <select
                    value={guestFilter}
                    onChange={(e) => setGuestFilter(e.target.value)}
                    className="w-full rounded-xl border border-mist-200 px-4 py-2.5 text-sm"
                  >
                    <option value="">Any</option>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n}+ guests
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal">
                    Room type
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full rounded-xl border border-mist-200 px-4 py-2.5 text-sm"
                  >
                    <option value="">All types</option>
                    {ROOM_TYPES.map((t) => (
                      <option key={t} value={t} className="capitalize">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal">View</label>
                  <select
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value)}
                    className="w-full rounded-xl border border-mist-200 px-4 py-2.5 text-sm"
                  >
                    <option value="">All views</option>
                    {VIEW_TYPES.map((v) => (
                      <option key={v} value={v} className="capitalize">
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Min price"
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <Input
                    label="Max price"
                    type="number"
                    placeholder="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-charcoal-500">
                {isLoading
                  ? 'Loading...'
                  : `${rooms.length} room${rooms.length !== 1 ? 's' : ''} found`}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? (
                  <X className="h-4 w-4" />
                ) : (
                  <SlidersHorizontal className="h-4 w-4" />
                )}
                Filters
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <div className="py-12 text-center">
                <p className="mb-4 text-terracotta">Failed to load rooms.</p>
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            ) : rooms.length === 0 ? (
              <div className="rounded-2xl border border-mist-200 bg-white py-16 text-center">
                <p className="mb-2 text-charcoal-600">No rooms match your filters.</p>
                <p className="mb-4 text-sm text-charcoal-400">
                  Try adjusting dates or filter criteria.
                </p>
                {hasActiveFilters ? (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {rooms.map((room) => (
                  <RoomCard key={room.id} room={room} checkIn={checkIn} checkOut={checkOut} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
