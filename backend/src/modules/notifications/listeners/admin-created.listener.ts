import { AdminCreatedEvent } from '@core/auth/events/admin-created.event';
import { InjectQueue } from '@nestjs/bullmq';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { EMAIL_JOBS, NOTIFICATIONS_QUEUE } from '../notifications.constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminCreatedListener {
  constructor(@InjectQueue(NOTIFICATIONS_QUEUE) private readonly notificationsQueue: Queue) {}

  @OnEvent(AdminCreatedEvent.EVENT_NAME)
  private async handle(event: AdminCreatedEvent) {
    await this.notificationsQueue.add(EMAIL_JOBS.SEND_ADMIN_ACTIVATION, event.payload);
  }
}
