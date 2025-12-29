import {
  RefreshJwtPayload,
  RefreshTokenWithAdmin,
} from '@auth/types/jwt.types';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (req: Request) => req?.cookies?.['refresh_token'],
      ]),
      secretOrKey: config.get<string>('server.jwtRefreshSecret')!,
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
