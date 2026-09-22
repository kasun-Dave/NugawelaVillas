import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Compass,
  User,
  Settings,
  Bell,
  Shield,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/utils/cn';
import { showToast } from '@/components/ui/toast-utils';

const navItems = [
  { to: '/account', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/account/bookings', label: 'My Bookings', icon: Calendar },
  { to: '/account/itinerary', label: 'Itinerary', icon: Compass },
  { to: '/account/profile', label: 'Profile', icon: User },
  { to: '/account/preferences', label: 'Preferences', icon: Settings },
  { to: '/account/notifications', label: 'Notifications', icon: Bell },
  { to: '/account/privacy', label: 'Privacy & Safety', icon: Shield },
];

export function AccountLayout() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { repositories } = await import('@/services/repository-registry');
    await repositories.auth.logout();
    showToast('Signed out successfully', 'info');
    navigate('/');
  };

  return (
    <div className="section-padding min-h-screen bg-ivory">
      <div className="container-narrow">
        <div className="mb-8">
          <h1 className="heading-section">My Account</h1>
          {user ? <p className="text-body mt-1">Welcome, {user.displayName}</p> : null}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <nav
              className="space-y-1 rounded-2xl border border-mist-200 bg-white p-4"
              aria-label="Account navigation"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-forest text-ivory'
                        : 'text-charcoal-600 hover:bg-mist hover:text-charcoal',
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-terracotta transition-colors hover:bg-terracotta/5"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </nav>
          </aside>

          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
