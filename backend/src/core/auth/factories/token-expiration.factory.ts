import { AuthService } from '../services/auth/auth.service';

export type TokenExpirationContext = {
  now: Date;
  accessExpiresAt: Date;
  refreshExpiresAt: Date;
  accessExpiresInSec: number;
  refreshExpiresInSec: number;
};

export class TokenExpirationFactory {
  static create(): TokenExpirationContext {
    const now = new Date();

    const accessMs = AuthService.ACCESS_TOKEN_EXPIRATION;
    const refreshMs = AuthService.REFRESH_TOKEN_EXPIRATION;

    return {
      now,
      accessExpiresAt: new Date(now.getTime() + accessMs),
      refreshExpiresAt: new Date(now.getTime() + refreshMs),
      accessExpiresInSec: Math.floor(accessMs / 1000),
      refreshExpiresInSec: Math.floor(refreshMs / 1000),
    };
  }
}
