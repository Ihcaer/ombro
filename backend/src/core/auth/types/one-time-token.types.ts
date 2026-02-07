import { AuthAdmin, AuthOneTimeToken } from '@generated/prisma-client';

export interface OneTimeTokenContext extends Pick<
  AuthOneTimeToken,
  'adminId' | 'hashedToken' | 'expiresAt'
> {
  admin?: Partial<AuthAdmin>;
}
