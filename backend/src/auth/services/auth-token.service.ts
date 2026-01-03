import { HashService } from '@common/hash/hash.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccessJwtPayload, RefreshJwtPayload } from '../types/jwt.types';
import { TokenExpirationContext } from '../factories/token-expiration.factory';

@Injectable()
export class AuthTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private hashService: HashService,
  ) {}

  async generateTokens(
    accessJwtPayload: AccessJwtPayload,
    refreshJwtPayload: RefreshJwtPayload,
    tokensExpiration: TokenExpirationContext,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessSecret = this.configService.get<string>(
      'server.jwtAccessSecret',
    );
    const refreshSecret = this.configService.get<string>(
      'server.jwtRefreshSecret',
    );
    if (!accessSecret || !refreshSecret) {
      throw new InternalServerErrorException('JWT secrets missing');
    }

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
