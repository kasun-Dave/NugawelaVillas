import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Compass, Sparkles, MapPin } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { repositories } from '@/services/repository-registry';
import { useItineraryStore } from '@/stores/itineraryStore';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { getUpcomingBookings } from '@/utils/booking';

export function AccountDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const itineraryCount = useItineraryStore((s) => s.items.length);

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: () => repositories.bookings.getByUserId(user!.id),
    enabled: !!user,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const { data: notifData } = useQuery({
    queryKey: ['notifications-count', user?.id],
    queryFn: () => repositories.notifications.getUnreadCount(user!.id),
    enabled: !!user,
  });

  const { data: adventureData } = useQuery({
    queryKey: ['adventure-progress', user?.id],
    queryFn: () => repositories.adventure.getProgress(user!.id),
    enabled: !!user,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const bookings = bookingsData?.data ?? [];
  const upcoming = getUpcomingBookings(bookings);
  const unreadCount = notifData?.data ?? 0;
  const adventureProgress = adventureData?.data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardCard
          icon={<Calendar className="h-5 w-5" />}
          label="Upcoming stays"
          value={isLoading ? '—' : String(upcoming.length)}
          href="/account/bookings"
        />
        <DashboardCard
          icon={<Compass className="h-5 w-5" />}
          label="Itinerary items"
          value={String(itineraryCount)}
          href="/account/itinerary"
        />
        <DashboardCard
          icon={<Sparkles className="h-5 w-5" />}
          label="Unread notifications"
          value={String(unreadCount)}
          href="/account/notifications"
        />
      </div>

      <section className="rounded-2xl border border-mist-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-xl font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/rooms">Book a Room</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/destinations">Explore Destinations</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/adventure">The Hidden Trail</Link>
          </Button>
          {adventureProgress ? (
            <Button variant="outline" asChild>
              <Link to="/adventure/dashboard">Adventure Dashboard</Link>
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link to="/adventure/play">Enter Adventure Code</Link>
            </Button>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-mist-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-xl font-semibold">Upcoming Stays</h2>
        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : upcoming.length === 0 ? (
          <p className="text-sm text-charcoal-500">
            No upcoming stays.{' '}
            <Link to="/rooms" className="text-forest hover:underline">
              Browse rooms
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 3).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-xl bg-mist/50 p-4"
              >
                <div>
                  <p className="font-mono text-sm font-bold text-forest">{b.referenceCode}</p>
                  <p className="text-sm text-charcoal-600">
                    {b.checkIn} → {b.checkOut}
                  </p>
                </div>
                <Link
                  to={`/booking/confirmation/${b.referenceCode}`}
                  className="text-sm text-forest hover:underline"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gold/30 bg-gold/5 p-6">
        <div className="flex items-start gap-4">
          <Sparkles className="h-6 w-6 shrink-0 text-gold" />
          <div>
            <h2 className="font-serif text-lg font-semibold text-charcoal">The Hidden Trail</h2>
            {adventureProgress ? (
              <p className="mt-1 text-sm text-charcoal-600">
                {adventureProgress.completedStageIds.length} stages completed ·{' '}
                {adventureProgress.artifactIds.length} artifacts collected
                {adventureProgress.paused ? ' · Paused' : ''}
              </p>
            ) : (
              <p className="mt-1 text-sm text-charcoal-600">
                Enter your welcome card code to begin the scavenger hunt adventure.
              </p>
            )}
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link to={adventureProgress ? '/adventure/dashboard' : '/adventure/play'}>
                {adventureProgress ? 'Continue Adventure' : 'Enter Code'}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-forest/20 bg-forest-50 p-6">
        <div className="flex items-start gap-4">
          <MapPin className="h-6 w-6 shrink-0 text-forest" />
          <div>
            <h2 className="font-serif text-lg font-semibold text-charcoal">
              Plan your valley days
            </h2>
            <p className="mt-1 text-sm text-charcoal-600">
              Save destinations and experiences to build your personalized itinerary with optimized
              day plans.
            </p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link to="/account/itinerary">Open Itinerary</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="rounded-2xl border border-mist-200 bg-white p-6 transition-shadow hover:shadow-md"
    >
      <div className="mb-2 flex items-center gap-2 text-forest">{icon}</div>
      <p className="font-serif text-2xl font-semibold text-charcoal">{value}</p>
      <p className="text-sm text-charcoal-500">{label}</p>
    </Link>
  );
}
