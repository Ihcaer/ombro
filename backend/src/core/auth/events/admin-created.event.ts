import { EventConfig } from '@shared/decorators';

@EventConfig
export class AdminCreatedEvent {
  static readonly EVENT_NAME = 'admin.created';

  constructor(
    public readonly accountConfirmationToken: string,
    public readonly newAdminData: { name: string; email: string },
  ) {}
}
