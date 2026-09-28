/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { EmailJobName, NOTIFICATIONS_QUEUE } from '../notifications.constants.js';
import { Job } from 'bullmq';
import { AdminPasswordResetRequestEmailHandler } from './handlers/email/auth/admin-password-reset-request-email.handler.js';
import { AdminCreationConfirmationEmailHandler } from './handlers/email/auth/admin-creation-confirmation-email.handler.js';
import { Logger } from '@nestjs/common';

@Processor(NOTIFICATIONS_QUEUE)
export class EmailConsumer extends WorkerHost {
  private readonly logger = new Logger(EmailConsumer.name);

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

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job failed: id=${job.id}, name=${job.name}, attempts=${job.attemptsMade}, reason=${error.message}`,
      error.stack,
    );
  }

  @OnWorkerEvent('error')
  onError(error: Error) {
    this.logger.error('BullMQ worker error: ' + error.message, error.stack);
  }
}
