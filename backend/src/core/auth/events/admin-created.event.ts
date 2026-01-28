export class AdminCreatedEvent {
  constructor(
    public readonly accountConfirmationToken: string,
    public readonly newAdminData: { name: string; email: string },
  ) {}
}
