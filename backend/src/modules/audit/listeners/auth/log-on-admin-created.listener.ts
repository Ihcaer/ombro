import { AdminCreatedEvent } from '@core/auth/events/admin-created.event.js';
import { LogJobsAuthModule } from '@modules/audit/audit-queue.constants.js';
import { AuditService } from '@modules/audit/audit.service.js';
import { CreateLogDto } from '@modules/audit/dto/create-log.dto.js';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { authModuleDataSerializer } from '../helpers/auth-module-data-serializer.js';
import { AuditActorType } from '@generated/prisma-client/enums.js';
import { Changes } from '@modules/audit/audit-log-fields.types.js';
import { buildChanges } from '../helpers/build-diff.js';

@Injectable()
export class LogOnAdminCreatedListener {
  constructor(private readonly auditService: AuditService) {}

  @OnEvent(AdminCreatedEvent.EVENT_NAME)
  private handle(event: AdminCreatedEvent): void {
    const eventPayload = event.payload;

    const actorId = eventPayload.actorId;
    const actorType: AuditActorType = actorId ? 'ADMIN' : 'SYSTEM';
    const changes: Changes = buildChanges({ after: eventPayload.newAdminData });

    const logData: CreateLogDto = authModuleDataSerializer({
      actorId: String(actorId),
      actorType,
      entityType: 'admin',
      entityId: String(eventPayload.newAdminData.id),
      visibility: 'OWNER',
      module: 'team',
      action: 'create',
      changes,
    });
    this.auditService.log({ name: LogJobsAuthModule.ADMIN_CREATED, log: logData });
  }
}
