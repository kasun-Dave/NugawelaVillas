import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Users,
  Key,
  List,
  LogOut,
  ArrowLeft,
  Calendar,
  ClipboardList,
  Compass,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { hasPermission } from '@/utils/permissions';
import type { Permission } from '@/types';
import { cn } from '@/utils/cn';
import { showToast } from '@/components/ui/toast-utils';

const navItems: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  permission: Permission | null;
}[] = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true, permission: null },
  { to: '/admin/bookings', label: 'Bookings', icon: Calendar, permission: 'bookings:read' },
  { to: '/admin/content', label: 'Content', icon: Compass, permission: 'content:read' },
  { to: '/admin/audit', label: 'Audit Log', icon: ClipboardList, permission: 'analytics:read' },
  {
    to: '/admin/adventure/progress',
    label: 'Guest Progress',
    icon: Users,
    permission: 'adventure:read',
  },
  { to: '/admin/adventure/stages', label: 'Stages', icon: List, permission: 'adventure:read' },
  {
    to: '/admin/adventure/codes',
    label: 'Adventure Codes',
    icon: Key,
    permission: 'adventure:write',
  },
  { to: '/admin/adventure/map', label: 'Trail Map', icon: Map, permission: 'adventure:read' },
];

export function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { repositories } = await import('@/services/repository-registry');
    await repositories.auth.logout();
    showToast('Signed out successfully', 'info');
    navigate('/');
  };

  const visibleNav = navItems.filter(
    (item) => !item.permission || (user && hasPermission(user.role, item.permission)),
  );

  return (
    <div className="section-padding min-h-screen bg-ivory">
      <div className="container-narrow">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-forest">
              Staff Portal
            </p>
            <h1 className="heading-section">Resort Admin</h1>
            {user ? (
              <p className="text-body mt-1">
                {user.displayName} · {user.role.replace('_', ' ')}
              </p>
            ) : null}
          </div>
          <NavLink
            to="/"
            className="flex items-center gap-2 text-sm text-charcoal-500 transition-colors hover:text-forest"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </NavLink>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <nav
              className="space-y-1 rounded-2xl border border-mist-200 bg-white p-4"
              aria-label="Admin navigation"
            >
              {visibleNav.map((item) => (
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
