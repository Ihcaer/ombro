import { AuthRefreshToken, AuthVerification } from '@generated/prisma-client/client.js';

type SessionId = AuthRefreshToken['sessionId'];

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
  sessionId: SessionId;
  privileges: number;
  verification: AuthVerification;
  isActivated: boolean;
};

export type RefreshJwtPayload = { id: number; sessionId: SessionId };

export type RefreshTokenWithAdmin = { id: number; refreshToken: string };

export type RefreshTokenMetadata = Pick<AuthRefreshToken, 'refreshTokenHash' | 'expiresAt'>;
export type RefreshTokenMetadataTable = RefreshTokenMetadata[];
