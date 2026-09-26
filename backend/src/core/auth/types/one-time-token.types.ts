import { AuthAdmin, AuthOneTimeToken } from '@generated/prisma-client/client.js';

export interface OneTimeTokenContext extends AuthOneTimeToken {
  admin?: Partial<AuthAdmin>;
}
