import {
  RefreshJwtPayload,
  RefreshTokenWithAdmin,
} from '@auth/types/jwt.types';
import serverConfig from '@config/server.config';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(serverConfig.KEY)
    private readonly serverConf: ConfigType<typeof serverConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (req: Request) => req?.cookies?.['refresh_token'],
      ]),
      secretOrKey: serverConf.jwtRefreshSecret,
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
