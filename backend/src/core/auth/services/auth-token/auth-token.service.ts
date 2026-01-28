import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccessJwtPayload, RefreshJwtPayload } from '../../types/jwt.types';
import { TokenExpirationContext } from '../../factories/token-expiration.factory';
import { HashService } from '@shared/hash/hash.service';
import securityConfig from '@core/config/envs/security.config';
import { randomBytes } from 'node:crypto';

@Injectable()
export class AuthTokenService {
  constructor(
    @Inject(securityConfig.KEY)
    private readonly securityConf: ConfigType<typeof securityConfig>,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async generateTokens(
    accessJwtPayload: AccessJwtPayload,
    refreshJwtPayload: RefreshJwtPayload,
    tokensExpiration: TokenExpirationContext,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessSecret = this.securityConf.jwtAccessSecret;
    const refreshSecret = this.securityConf.jwtRefreshSecret;

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

  generateOneTimeTokenPair(): {
    rawToken: Base64URLString;
    hashedToken: string;
  } {
    const rawToken = randomBytes(32).toString('base64url');
    const hashedToken = this.hashService.hash(rawToken);

    return { rawToken, hashedToken };
  }

  compareOneTimeTokens(
    inputToken: Base64URLString,
    savedToken: string,
  ): boolean {
    return this.hashService.compareHash(inputToken, savedToken);
  }
}
