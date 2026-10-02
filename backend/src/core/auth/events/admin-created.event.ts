import { EventConfig } from '@shared/decorators/index.js';
import { NewlyCreatedAdmin } from '../types/admin.types.js';

export type AdminCreatedPayload = {
  readonly actorId: number | null;
  readonly accountConfirmationToken: string;
  readonly newAdminData: NewlyCreatedAdmin;
};

@EventConfig
export class AdminCreatedEvent {
  static readonly EVENT_NAME = 'admin.created';

  constructor(readonly payload: AdminCreatedPayload) {}
}
