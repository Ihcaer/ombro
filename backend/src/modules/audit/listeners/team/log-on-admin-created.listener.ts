import { AdminCreatedEvent } from '@core/auth/events/admin-created.event.js';
import { LogJobsAuthModule } from '@modules/audit/audit-queue.constants.js';
import { CreateLogDto } from '@modules/audit/dto/create-log.dto.js';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuditActorType } from '@generated/prisma-client/enums.js';
import { buildChanges } from '../helpers/build-diff.js';
import { AuditBaseListener } from '../base-listener.js';

@Injectable()
export class LogOnAdminCreatedListener extends AuditBaseListener<AdminCreatedEvent> {
  @OnEvent(AdminCreatedEvent.EVENT_NAME)
  protected handle(event: AdminCreatedEvent): void {
    const eventPayload = event.payload;

    const actorId = eventPayload.actorId;
    const actorType: AuditActorType = actorId ? 'ADMIN' : 'SYSTEM';
    const changes = buildChanges({ after: eventPayload.newAdminData });

    const logData: CreateLogDto = {
      actorId: String(actorId),
      actorType,
      entityType: 'ADMIN',
      entityId: String(eventPayload.newAdminData.id),
      visibility: 'MANAGER',
      module: 'TEAM',
      action: 'CREATE',
      changes,
    };
    this.auditService.log({ name: LogJobsAuthModule.ADMIN_CREATED, log: logData });
  }
}
