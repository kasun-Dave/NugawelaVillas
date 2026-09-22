import type { Role, Permission } from '@/types';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  resort_admin: [
    'bookings:read',
    'bookings:write',
    'rooms:read',
    'rooms:write',
    'guests:read',
    'adventure:read',
    'adventure:write',
    'content:read',
    'content:write',
    'analytics:read',
    'admin:access',
  ],
  reception_staff: ['bookings:read', 'bookings:write', 'rooms:read', 'guests:read', 'admin:access'],
  adventure_guide: ['adventure:read', 'adventure:write', 'guests:read', 'admin:access'],
  content_manager: ['content:read', 'content:write', 'rooms:read', 'admin:access'],
  partner_host: ['adventure:read'],
  guest: ['bookings:read', 'adventure:read'],
};

export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return getPermissionsForRole(role).includes(permission);
}

export function canAccessRoute(role: Role | null, path: string): boolean {
  if (!role) return !path.startsWith('/account') && !path.startsWith('/admin');
  if (path.startsWith('/admin')) {
    return hasPermission(role, 'admin:access');
  }
  return true;
}

export function evaluatePolicy(
  role: Role | null,
  permission: Permission,
): { allowed: boolean; reason?: string } {
  if (!role) {
    return { allowed: false, reason: 'Authentication required' };
  }
  if (!hasPermission(role, permission)) {
    return { allowed: false, reason: `Role '${role}' lacks permission '${permission}'` };
  }
  return { allowed: true };
}
