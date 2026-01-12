import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RefreshJwtPayload, RefreshTokenWithAdmin } from '../types/jwt.types';
import securityConfig from '@core/config/envs/security.config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(securityConfig.KEY)
    private readonly securityConf: ConfigType<typeof securityConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (req: Request) => req?.cookies?.['refresh_token'],
      ]),
      secretOrKey: securityConf.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: RefreshJwtPayload): RefreshTokenWithAdmin {
    const cookies = req.cookies as { refresh_token?: unknown };
    const refreshToken =
      typeof cookies.refresh_token === 'string'
        ? cookies.refresh_token
        : undefined;

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token missing');
    }

    return { id: payload.id, refreshToken };
  }
}
