import { AdminProfileData } from '@core/auth/types/admin.types.js';
import { AuditLogRecord } from '@modules/audit/types/audit-log.types.js';

type AdminOwnProfile = Pick<AdminProfileData, 'email' | 'lastLogged'>;

export class AdminOwnProfileDataResponseDto {
  adminProfile!: AdminOwnProfile;
  auditLog!: AuditLogRecord[];
}
