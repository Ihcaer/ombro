import { AuthAdmin, AuthOneTimeToken } from '@generated/prisma-client';

export interface OneTimeTokenContext extends AuthOneTimeToken {
  admin?: Partial<AuthAdmin>;
}
