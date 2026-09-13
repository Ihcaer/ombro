/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EmailJobName, NOTIFICATIONS_QUEUE } from '../notifications.constants';
import { Job } from 'bullmq';
import { AdminPasswordResetRequestEmailHandler } from './handlers/email/auth/admin-password-reset-request-email.handler';
import { AdminCreationConfirmationEmailHandler } from './handlers/email/auth/admin-creation-confirmation-email.handler';

@Processor(NOTIFICATIONS_QUEUE)
export class EmailConsumer extends WorkerHost {
  constructor(
    private readonly adminPasswordResetHandler: AdminPasswordResetRequestEmailHandler,
    private readonly adminCreationConfirmationHandler: AdminCreationConfirmationEmailHandler,
  ) {
    super();
  }

  async process(job: Job<any, any, EmailJobName>): Promise<any> {
    switch (job.name) {
      case 'send-admin-password-reset-email':
        return this.adminPasswordResetHandler.handle(job.data);
      case 'send-admin-account-activation-email':
        return this.adminCreationConfirmationHandler.handle(job.data);
    }
  }
}
