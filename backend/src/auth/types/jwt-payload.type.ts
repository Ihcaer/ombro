import { AuthVerification } from '@generated/prisma-client';

export type JwtPayload = {
  id: number;
  privileges: number;
  verification: AuthVerification;
  isActivated: boolean;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
