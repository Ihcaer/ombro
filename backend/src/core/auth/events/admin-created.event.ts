import { EventConfig } from '@shared/decorators';

export type AdminCreatedPayload = {
  readonly accountConfirmationToken: string;
  readonly newAdminData: { readonly name: string; readonly email: string };
};

@EventConfig
export class AdminCreatedEvent {
  static readonly EVENT_NAME = 'admin.created';

  constructor(readonly payload: AdminCreatedPayload) {}
}
