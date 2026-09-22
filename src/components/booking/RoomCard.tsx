import { Link } from 'react-router-dom';
import { Users, Mountain, Maximize } from 'lucide-react';
import type { Room } from '@/types';
import { ImageWithFallback } from '@/components/ui/shared';
import { Button } from '@/components/ui/Button';

interface RoomCardProps {
  room: Room;
  checkIn?: string;
  checkOut?: string;
  showBookButton?: boolean;
  onSelect?: (roomId: string) => void;
  selected?: boolean;
  layout?: 'grid' | 'list';
}

export function RoomCard({
  room,
  checkIn,
  checkOut,
  showBookButton = true,
  onSelect,
  selected,
  layout = 'grid',
}: RoomCardProps) {
  const bookUrl =
    checkIn && checkOut
      ? `/booking/room?checkIn=${checkIn}&checkOut=${checkOut}&roomId=${room.id}`
      : `/rooms/${room.slug}`;

  if (layout === 'list') {
    return (
      <article
        className={`flex gap-4 rounded-2xl border bg-white p-4 transition-shadow ${
          selected
            ? 'border-forest shadow-md ring-2 ring-forest/20'
            : 'border-mist-200 hover:shadow-md'
        }`}
      >
        <Link to={`/rooms/${room.slug}`} className="shrink-0">
          <ImageWithFallback
            src={room.images[0]}
            alt={room.name}
            className="h-32 w-32 rounded-xl"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link to={`/rooms/${room.slug}`}>
            <h3 className="font-serif text-xl font-semibold text-charcoal transition-colors hover:text-forest">
              {room.name}
            </h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-charcoal-600">{room.shortDescription}</p>
          <RoomMeta room={room} />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-lg font-semibold text-forest">
              ${room.basePricePerNight}
              <span className="text-sm font-normal text-charcoal-400"> / night</span>
            </p>
            {onSelect ? (
              <Button
                variant={selected ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onSelect(room.id)}
              >
                {selected ? 'Selected' : 'Select'}
              </Button>
            ) : showBookButton ? (
              <Button variant="primary" size="sm" asChild>
                <Link to={bookUrl}>Book Now</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group overflow-hidden rounded-2xl border bg-white transition-shadow ${
        selected
          ? 'border-forest shadow-md ring-2 ring-forest/20'
          : 'border-mist-200 hover:shadow-md'
      }`}
    >
      <Link to={`/rooms/${room.slug}`} className="block">
        <ImageWithFallback src={room.images[0]} alt={room.name} className="h-52 w-full" />
      </Link>
      <div className="p-6">
        <Link to={`/rooms/${room.slug}`}>
          <h3 className="font-serif text-xl font-semibold text-charcoal transition-colors group-hover:text-forest">
            {room.name}
          </h3>
        </Link>
        <RoomMeta room={room} />
        <p className="mt-2 line-clamp-2 text-sm text-charcoal-600">{room.shortDescription}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-forest">
            ${room.basePricePerNight}
            <span className="text-sm font-normal text-charcoal-400"> / night</span>
          </p>
          {onSelect ? (
            <Button
              variant={selected ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onSelect(room.id)}
            >
              {selected ? 'Selected' : 'Select'}
            </Button>
          ) : showBookButton ? (
            <Button variant="primary" size="sm" asChild>
              <Link to={bookUrl}>Book Now</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function RoomMeta({ room }: { room: Room }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-charcoal-400">
      <span className="flex items-center gap-1 capitalize">
        <Mountain className="h-3.5 w-3.5" />
        {room.viewType} view
      </span>
      <span className="flex items-center gap-1">
        <Users className="h-3.5 w-3.5" />
        Up to {room.maxGuests}
      </span>
      <span className="flex items-center gap-1">
        <Maximize className="h-3.5 w-3.5" />
        {room.sizeSqm} m²
      </span>
      <span className="rounded-full bg-mist px-2 py-0.5 capitalize text-charcoal-600">
        {room.type}
      </span>
    </div>
  );
}
