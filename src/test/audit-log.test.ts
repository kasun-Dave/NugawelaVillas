import { describe, it, expect, beforeEach } from 'vitest';
import { appendAuditLog, getAuditLogs } from '@/utils/audit-log';
import { removeStorageItem, STORAGE_KEYS } from '@/utils/storage';

describe('audit-log', () => {
  beforeEach(() => {
    removeStorageItem(STORAGE_KEYS.AUDIT_LOGS);
  });

  it('appends and retrieves audit entries', () => {
    appendAuditLog(
      { id: 'admin-1', name: 'Admin', role: 'resort_admin' },
      'booking.status_updated',
      'booking',
      'booking-1',
      'Test update',
    );

    const logs = getAuditLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].summary).toBe('Test update');
    expect(logs[0].actorName).toBe('Admin');
  });
});
