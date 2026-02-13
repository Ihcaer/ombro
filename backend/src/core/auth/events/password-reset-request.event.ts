import { EventConfig } from '@shared/decorators';

@EventConfig
export class PasswordResetRequestEvent {
  static readonly EVENT_NAME = 'auth.password_reset_requested';

  constructor(
    readonly tokenData: { readonly token: string; readonly expirationTimeMinutes: number },
    readonly adminData: { readonly name: string; readonly email: string },
  ) {}
}
