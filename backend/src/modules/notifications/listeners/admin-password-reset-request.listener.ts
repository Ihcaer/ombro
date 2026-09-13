import { InjectQueue } from '@nestjs/bullmq';
import { EMAIL_JOBS, NOTIFICATIONS_QUEUE } from '../notifications.constants';
import { Queue } from 'bullmq';
import { OnEvent } from '@nestjs/event-emitter';
import { AdminPasswordResetRequestEvent } from '@core/auth/events/admin-password-reset-request.event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminPasswordResetRequestListener {
  constructor(@InjectQueue(NOTIFICATIONS_QUEUE) private readonly notificationsQueue: Queue) {}

  @OnEvent(AdminPasswordResetRequestEvent.EVENT_NAME)
  private async handle(event: AdminPasswordResetRequestEvent) {
    await this.notificationsQueue.add(EMAIL_JOBS.SEND_PASSWORD_RESET, event.payload);
  }
}
