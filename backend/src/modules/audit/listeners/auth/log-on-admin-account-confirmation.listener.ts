import { Injectable } from '@nestjs/common';
import { AuditBaseListener } from '../base-listener.js';
import { AdminAccountConfirmedEvent } from '@core/auth/events/admin-account-confirmed.event.js';
import { OnEvent } from '@nestjs/event-emitter';
import {
  FullAdminWithoutPasswordAndTimers,
  AdminPrivilegeTranslatedField,
} from '@core/auth/types/admin.types.js';
import { PrivilegesUtils } from '@core/auth/utils/privileges.utils.js';
import { CreateLogDto } from '@modules/audit/dto/create-log.dto.js';
import { buildChanges } from '../helpers/build-diff.js';
import { Changes } from '@modules/audit/audit-log-fields.types.js';
import { LogJobsAuthModule } from '@modules/audit/audit-queue.constants.js';

type AdminWithTranslatedPrivileges = Omit<FullAdminWithoutPasswordAndTimers, 'privileges'> &
  AdminPrivilegeTranslatedField;

@Injectable()
export class LogOnAdminAccountConfirmationListener extends AuditBaseListener<AdminAccountConfirmedEvent> {
  @OnEvent(AdminAccountConfirmedEvent.EVENT_NAME)
  protected handle(event: AdminAccountConfirmedEvent): void {
    const payload = event.payload;

    const admin: AdminWithTranslatedPrivileges = {
      ...payload.admin,
      privileges: PrivilegesUtils.bitmaskToArray(payload.admin.privileges),
    };
    const updatedAdmin: AdminWithTranslatedPrivileges = {
      ...payload.updatedAdmin,
      privileges: PrivilegesUtils.bitmaskToArray(payload.updatedAdmin.privileges),
    };
    const changes: Changes<AdminWithTranslatedPrivileges> = buildChanges({
      before: admin,
      after: updatedAdmin,
    });

    const log: CreateLogDto = {
      actorId: String(admin.id),
      actorType: 'ADMIN',
      entityType: 'ADMIN',
      entityId: String(admin.id),
      visibility: 'MANAGER',
      module: 'AUTH',
      action: 'UPDATE',
      changes,
    };
    this.auditService.log({ name: LogJobsAuthModule.ADMIN_ACCOUNT_CONFIRMED, log });
  }
}
