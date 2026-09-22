export type AuditAction =
  | 'booking.cancelled'
  | 'booking.status_updated'
  | 'adventure.code_toggled'
  | 'adventure.guest_reset'
  | 'content.destination_featured'
  | 'content.experience_featured';

export interface AuditActor {
  id: string;
  name: string;
  role: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: AuditAction;
  targetType: string;
  targetId: string;
  summary: string;
  metadata?: Record<string, string>;
}
