import { EventConfig } from '@shared/decorators/event.decorator.js';
import { FullAdminWithoutPasswordAndTimersBeforeAndAfter } from '../types/admin.types.js';

export type AdminAccountConfirmedEventPayload = FullAdminWithoutPasswordAndTimersBeforeAndAfter;

@EventConfig
export class AdminAccountConfirmedEvent {
  static readonly EVENT_NAME = 'admin.account-confirmed';
  constructor(readonly payload: AdminAccountConfirmedEventPayload) {}
}
