import { AdminPrivileges } from '@core/auth/enums/admin-privileges.js';
import { PrivilegesUtils } from '@core/auth/utils/privileges.utils.js';
import { PrismaService } from '@core/database/prisma/prisma.service.js';
import { AuditLog, AuditVisibility, AuthAdmin } from '@generated/prisma-client/client.js';
import { AuditLogWhereInput } from '@generated/prisma-client/models.js';
import { EntityType } from '@modules/audit/audit-log-fields.enums.js';
import { AuditLogRecord } from '@modules/audit/types/audit-log.types.js';
import { Injectable } from '@nestjs/common';

type GetLogRecordsOptions = { recordsNumber?: number; lastRecordId?: AuditLog['id'] };

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async getLogs(
    targetId: AuthAdmin['id'],
    requester: { id: AuthAdmin['id']; privileges: AuthAdmin['privileges'] },
    { recordsNumber = 10, lastRecordId }: GetLogRecordsOptions = {},
  ): Promise<AuditLogRecord[]> {
    const isSelf = targetId === requester.id;

    const where: AuditLogWhereInput = isSelf
      ? {
          OR: [
            {
              actorType: 'ADMIN',
              actorId: String(requester.id),
            },
            {
              entityType: EntityType.ADMIN,
              entityId: String(targetId),
              visibility: { in: this.getAllowedVisibilities(requester.id, isSelf) },
            },
          ],
        }
      : {
          visibility: { in: this.getAllowedVisibilities(requester.privileges, isSelf) },
          OR: [
            { entityType: EntityType.ADMIN, entityId: String(targetId) },
            { actorType: 'ADMIN', actorId: String(targetId) },
          ],
        };

    return (await this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: recordsNumber,
      ...(lastRecordId ? { skip: 1, cursor: { id: lastRecordId } } : {}),
    })) as AuditLogRecord[];
  }

  private getAllowedVisibilities(
    privileges: AuthAdmin['privileges'],
    isSelf: boolean,
  ): AuditVisibility[] {
    const allowed: AuditVisibility[] = [AuditVisibility.PUBLIC];

    if (isSelf) allowed.push(AuditVisibility.ACTOR_AND_TARGET);

    if (PrivilegesUtils.hasAll(privileges, [AdminPrivileges.SUPER_ADMIN])) {
      allowed.push(AuditVisibility.SUPER_ADMIN, AuditVisibility.MANAGER);
    } else if (PrivilegesUtils.hasAll(privileges, [AdminPrivileges.ADMINS_MANAGE])) {
      allowed.push(AuditVisibility.MANAGER);
    }

    return allowed;
  }
}
