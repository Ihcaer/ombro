import { AccessJwtPayload } from '@auth/types/jwt.types';
import securityConfig from '@config/security.config';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(securityConfig.KEY)
    private readonly securityConf: ConfigType<typeof securityConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: securityConf.jwtAccessSecret,
    });
  }

  validate(payload: Readonly<AccessJwtPayload>) {
    return payload;
  }
}
