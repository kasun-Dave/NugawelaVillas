import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { hasPermission } from '@/utils/permissions';
import type { Permission } from '@/types';

interface AdminRouteProps {
  children: React.ReactNode;
  permission?: Permission;
}

export function AdminRoute({ children, permission }: AdminRouteProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" state={{ from: '/admin' }} replace />;
  }

  if (!hasPermission(user.role, 'admin:access')) {
    return <Navigate to="/account" replace />;
  }

  if (permission && !hasPermission(user.role, permission)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
