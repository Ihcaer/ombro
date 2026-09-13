import { EventConfig } from '@shared/decorators';

export type AdminPasswordResetRequestPayload = {
  readonly tokenData: { readonly token: string; readonly expirationTimeMinutes: number };
  readonly adminData: { readonly name: string; readonly email: string };
};

@EventConfig
export class AdminPasswordResetRequestEvent {
  static readonly EVENT_NAME = 'auth.password_reset_requested';

  constructor(readonly payload: AdminPasswordResetRequestPayload) {}
}
