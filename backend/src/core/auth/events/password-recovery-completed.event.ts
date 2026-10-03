import { EventConfig } from '@shared/decorators/event.decorator.js';

export type PasswordRecoveryCompletedEventPayload = { readonly adminId: number };

@EventConfig
export class PasswordRecoveryCompletedEvent {
  static readonly EVENT_NAME = 'admin.password-recovery-completed';

  constructor(readonly payload: PasswordRecoveryCompletedEventPayload) {}
}
