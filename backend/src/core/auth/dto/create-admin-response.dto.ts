import { AuthAdmin } from '@generated/prisma-client';

export type CreateAdminResponseDto = Readonly<
  NonNullable<Pick<AuthAdmin, 'displayName' | 'email' | 'privileges'>>
>;
