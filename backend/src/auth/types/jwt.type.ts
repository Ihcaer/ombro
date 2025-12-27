export type TokensExpirationTimes = {
  readonly accessExpiration: number;
  readonly refreshExpiration: number;
};

export type AuthJwtTokens = {
  readonly accessToken: string;
  readonly refreshToken: string;
};
