import { REFRESH_TOKEN_COOKIE_NAME } from '@core/auth/auth.constants';
import { Environment } from '@core/config/envs/server.config';
import type { Response } from 'express';

export const setRefreshTokenCookie = (
  res: Response,
  token: string,
  maxAge: number,
  environment: Environment,
) => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: environment === Environment.Production,
    sameSite: 'strict',
    maxAge: maxAge,
  });
};
