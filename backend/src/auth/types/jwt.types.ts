import { AuthVerification } from '@generated/prisma-client';

export type TokensExpirationTimes = {
  readonly accessExpiration: number;
  readonly refreshExpiration: number;
};

export type AuthJwtTokens = {
  readonly accessToken: string;
  readonly refreshToken: string;
};

export type AccessJwtPayload = {
  id: number;
  privileges: number;
  verification: AuthVerification;
  isActivated: boolean;
};

export type RefreshJwtPayload = { id: number };

export type RefreshTokenWithAdmin = { id: number; refreshToken: string };
