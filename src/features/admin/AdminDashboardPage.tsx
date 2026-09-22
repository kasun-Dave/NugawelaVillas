import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, Map, Key, Calendar, Trophy, Pause } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export function AdminDashboardPage() {
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-adventure-analytics'],
    queryFn: () => repositories.admin.getAdventureAnalytics(),
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['admin-booking-summary'],
    queryFn: () => repositories.admin.getBookingSummary(),
  });

  const a = analytics?.data;
  const b = bookings?.data;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 font-serif text-xl font-semibold">Adventure Analytics</h2>
        {analyticsLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatCard
              icon={<Users className="h-5 w-5" />}
              label="Guests on trail"
              value={String(a?.totalGuestsWithProgress ?? 0)}
            />
            <StatCard
              icon={<Trophy className="h-5 w-5" />}
              label="Completed"
              value={String(a?.completedAdventures ?? 0)}
            />
            <StatCard
              icon={<Map className="h-5 w-5" />}
              label="Active trails"
              value={String(a?.activeAdventures ?? 0)}
            />
            <StatCard
              icon={<Pause className="h-5 w-5" />}
              label="Paused"
              value={String(a?.pausedAdventures ?? 0)}
            />
            <StatCard
              icon={<Key className="h-5 w-5" />}
              label="Active codes"
              value={String(a?.activeCodes ?? 0)}
            />
            <StatCard
              icon={<Map className="h-5 w-5" />}
              label="Avg stages done"
              value={String(a?.averageStagesCompleted ?? 0)}
            />
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-serif text-xl font-semibold">Bookings Snapshot</h2>
        {bookingsLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              icon={<Calendar className="h-5 w-5" />}
              label="Total bookings"
              value={String(b?.totalBookings ?? 0)}
            />
            <StatCard
              icon={<Calendar className="h-5 w-5" />}
              label="Confirmed"
              value={String(b?.confirmedBookings ?? 0)}
            />
            <StatCard
              icon={<Calendar className="h-5 w-5" />}
              label="Upcoming"
              value={String(b?.upcomingBookings ?? 0)}
            />
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-mist-200 bg-white p-6">
        <h2 className="mb-3 font-serif text-lg font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/admin/bookings">Manage Bookings</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/content">Content</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/audit">Audit Log</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/adventure/progress">Guest Progress</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/adventure/map">Trail Map</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-mist-200 bg-white p-5">
      <div className="mb-2 text-forest">{icon}</div>
      <p className="font-serif text-2xl font-semibold text-charcoal">{value}</p>
      <p className="text-sm text-charcoal-500">{label}</p>
    </div>
  );
}
