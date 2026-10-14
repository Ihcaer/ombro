import { EventConfig } from '@shared/decorators/event.decorator.js';

export type AdminPasswordChangedEventPayload = { readonly adminId: number };

@EventConfig
export class AdminPasswordChangedEvent {
  static readonly EVENT_NAME = 'admin.password_changed';

  constructor(readonly payload: AdminPasswordChangedEventPayload) {}
}
