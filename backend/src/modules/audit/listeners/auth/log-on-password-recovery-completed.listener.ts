import { PasswordRecoveryCompletedEvent } from '@core/auth/events/password-recovery-completed.event.js';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuditBaseListener } from '../base-listener.js';
import { CreateLogDto } from '@modules/audit/dto/create-log.dto.js';
import { LogJobsAuthModule } from '@modules/audit/audit-queue.constants.js';
import { Action, EntityType, Module } from '@modules/audit/audit-log-fields.enums.js';

@Injectable()
export class LogOnPasswordRecoveryCompletedListener extends AuditBaseListener<PasswordRecoveryCompletedEvent> {
  @OnEvent(PasswordRecoveryCompletedEvent.EVENT_NAME)
  protected handle(event: PasswordRecoveryCompletedEvent): void {
    const adminId = event.payload.adminId;
    const log: CreateLogDto = {
      actorId: String(adminId),
      actorType: 'ADMIN',
      entityType: EntityType.ADMIN,
      entityId: String(adminId),
      visibility: 'PRIVATE',
      module: Module.AUTH,
      action: Action.UPDATE,
    };
    this.auditService.log({ name: LogJobsAuthModule.PASSWORD_RECOVERY_COMPLETED, log });
  }
}
