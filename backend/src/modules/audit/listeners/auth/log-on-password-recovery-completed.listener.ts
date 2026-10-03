import { PasswordRecoveryCompletedEvent } from '@core/auth/events/password-recovery-completed.event.js';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuditBaseListener } from '../base-listener.js';
import { CreateLogDto } from '@modules/audit/dto/create-log.dto.js';
import { LogJobsAuthModule } from '@modules/audit/audit-queue.constants.js';

@Injectable()
export class LogOnPasswordRecoveryCompletedListener extends AuditBaseListener<PasswordRecoveryCompletedEvent> {
  @OnEvent(PasswordRecoveryCompletedEvent.EVENT_NAME)
  protected handle(event: PasswordRecoveryCompletedEvent): void {
    const adminId = event.payload.adminId;
    const log: CreateLogDto = {
      actorId: String(adminId),
      actorType: 'ADMIN',
      entityType: 'ADMIN',
      entityId: String(adminId),
      visibility: 'PRIVATE',
      module: 'AUTH',
      action: 'UPDATE',
    };
    this.auditService.log({ name: LogJobsAuthModule.PASSWORD_RECOVERY_COMPLETED, log });
  }
}
