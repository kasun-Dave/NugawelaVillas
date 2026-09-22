import { describe, it, expect } from 'vitest';
import { hasPermission, evaluatePolicy, getPermissionsForRole } from '@/utils/permissions';

describe('permissions', () => {
  it('grants admin full access', () => {
    expect(hasPermission('resort_admin', 'admin:access')).toBe(true);
    expect(hasPermission('resort_admin', 'analytics:read')).toBe(true);
  });

  it('restricts guest permissions', () => {
    expect(hasPermission('guest', 'admin:access')).toBe(false);
    expect(hasPermission('guest', 'bookings:read')).toBe(true);
  });

  it('evaluates policy for unauthenticated users', () => {
    const result = evaluatePolicy(null, 'bookings:read');
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('Authentication required');
  });

  it('evaluates policy for authorized role', () => {
    const result = evaluatePolicy('guest', 'bookings:read');
    expect(result.allowed).toBe(true);
  });

  it('returns permissions for each role', () => {
    expect(getPermissionsForRole('partner_host').length).toBeGreaterThan(0);
  });
});
