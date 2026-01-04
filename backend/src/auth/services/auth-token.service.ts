import { HashService } from '@common/hash/hash.service';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccessJwtPayload, RefreshJwtPayload } from '../types/jwt.types';
import { TokenExpirationContext } from '../factories/token-expiration.factory';
import serverConfig from '@config/server.config';

@Injectable()
export class AuthTokenService {
  constructor(
    @Inject(serverConfig.KEY)
    private readonly serverConf: ConfigType<typeof serverConfig>,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async generateTokens(
    accessJwtPayload: AccessJwtPayload,
    refreshJwtPayload: RefreshJwtPayload,
    tokensExpiration: TokenExpirationContext,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessSecret = this.serverConf.jwtAccessSecret;
    const refreshSecret = this.serverConf.jwtRefreshSecret;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessJwtPayload, {
        secret: accessSecret,
        expiresIn: tokensExpiration.accessExpiresInSec,
      }),
      this.jwtService.signAsync(refreshJwtPayload, {
        secret: refreshSecret,
        expiresIn: tokensExpiration.refreshExpiresInSec,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  hashRefreshToken(token: string): string {
    return this.hashService.hash(token);
  }
}
