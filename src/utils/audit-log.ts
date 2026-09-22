import type { AuditLogEntry, AuditActor, AuditAction } from '@/types/audit';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage';

export function getAuditLogs(): AuditLogEntry[] {
  return getStorageItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, []);
}

export function appendAuditLog(
  actor: AuditActor,
  action: AuditAction,
  targetType: string,
  targetId: string,
  summary: string,
  metadata?: Record<string, string>,
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    targetType,
    targetId,
    summary,
    metadata,
  };

  const logs = getAuditLogs();
  logs.unshift(entry);
  setStorageItem(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 200));
  return entry;
}
