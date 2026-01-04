import { AccessJwtPayload } from '@auth/types/jwt.types';
import serverConfig from '@config/server.config';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(serverConfig.KEY)
    private readonly serverConf: ConfigType<typeof serverConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: serverConf.jwtAccessSecret,
    });
  }

  validate(payload: Readonly<AccessJwtPayload>) {
    return payload;
  }
}
