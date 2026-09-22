import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, Mountain } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { SectionHeading, ImageWithFallback } from '@/components/ui/shared';
import { CardSkeleton } from '@/components/ui/Skeleton';

export function FeaturedRoomsSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['rooms', 'featured'],
    queryFn: () => repositories.rooms.getFeatured(),
  });

  const rooms = data?.data ?? [];

  return (
    <section className="section-padding bg-ivory" aria-labelledby="featured-rooms-heading">
      <div className="container-narrow">
        <SectionHeading
          title="Featured Rooms"
          subtitle="Handcrafted spaces where hill-country calm meets refined comfort."
          action={{ label: 'View All Rooms', href: '/rooms' }}
        />

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <p className="mt-10 text-terracotta" role="alert">
            Unable to load rooms. Please try again later.
          </p>
        ) : rooms.length === 0 ? (
          <p className="mt-10 text-charcoal-500">No featured rooms available at the moment.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <article
                key={room.id}
                className="group overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <Link to={`/rooms/${room.slug}`} className="block">
                  <ImageWithFallback src={room.images[0]} alt={room.name} className="h-52 w-full" />
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-2 text-xs text-charcoal-400">
                      <Mountain className="h-3.5 w-3.5" />
                      <span className="capitalize">{room.viewType} view</span>
                      <span>·</span>
                      <Users className="h-3.5 w-3.5" />
                      <span>Up to {room.maxGuests} guests</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-charcoal transition-colors group-hover:text-forest">
                      {room.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-charcoal-600">
                      {room.shortDescription}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-lg font-semibold text-forest">
                        ${room.basePricePerNight}
                        <span className="text-sm font-normal text-charcoal-400"> / night</span>
                      </p>
                      <span className="text-sm font-medium text-forest group-hover:underline">
                        View details →
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
