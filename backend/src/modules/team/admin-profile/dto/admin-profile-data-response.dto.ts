import { AdminProfileData } from '@core/auth/types/admin.types.js';
import { AuditLogRecord } from '@modules/audit/types/audit-log.types.js';

export class AdminProfileDataResponseDto {
  adminProfile!: AdminProfileData;
  auditLog!: AuditLogRecord[];
}
