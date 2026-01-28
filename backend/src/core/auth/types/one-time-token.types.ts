import { AuthAdmin } from '@generated/prisma-client';

export type OneTimeTokenContext = {
  adminId: number;
  hashedToken: string;
  expiresAt: Date;
  admin?: Partial<AuthAdmin>;
};
