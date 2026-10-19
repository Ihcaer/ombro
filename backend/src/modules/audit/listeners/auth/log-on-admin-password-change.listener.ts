import { Injectable } from '@nestjs/common';
import { AuditBaseListener } from '../base-listener.js';
import { AdminPasswordChangedEvent } from '@core/auth/events/admin-password-changed.event.js';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateLogDto } from '@modules/audit/dto/create-log.dto.js';
import { Action, EntityType, Module } from '@modules/audit/audit-log-fields.enums.js';
import { buildChanges } from '../helpers/build-diff.js';
import { AuthAdmin } from '@generated/prisma-client/client.js';
import { Changes } from '@modules/audit/types/audit-log-fields.types.js';
import { LogJobsAuthModule } from '@modules/audit/audit-queue.constants.js';

@Injectable()
export class LogOnAdminPasswordChangeListener extends AuditBaseListener<AdminPasswordChangedEvent> {
  @OnEvent(AdminPasswordChangedEvent.EVENT_NAME)
  protected handle(event: AdminPasswordChangedEvent): void {
    const adminId = event.payload.adminId.toString();
    const changes: Changes<AuthAdmin> = buildChanges({
      // Non-sensitive dummy values to indicate field presence
      before: { password: 'DUMMY_PASSWORD_1' },
      after: { password: 'DUMMY_PASSWORD_2' },
      sensitiveFields: ['password'],
    });

    const log: CreateLogDto = {
      actorType: 'ADMIN',
      actorId: adminId,
      entityType: EntityType.ADMIN,
      entityId: adminId,
      visibility: 'PRIVATE',
      module: Module.AUTH,
      action: Action.UPDATE,
      changes,
    };
    this.auditService.log({ name: LogJobsAuthModule.ADMIN_PASSWORD_CHANGED, log });
  }
}
