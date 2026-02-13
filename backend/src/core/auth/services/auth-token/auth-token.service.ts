import {
  BadRequestException,
  GoneException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccessJwtPayload, RefreshJwtPayload } from '../../types/jwt.types';
import { TokenExpirationContext } from '../../factories/token-expiration.factory';
import { HashService } from '@shared/hash/hash.service';
import securityConfig from '@core/config/envs/security.config';
import { randomBytes } from 'node:crypto';
import { OneTimeTokenContext } from '@core/auth/types/one-time-token.types';
import { AuthAdmin, AuthTokenType } from '@generated/prisma-client';
import { PrismaService } from '@core/database/prisma/prisma.service';

@Injectable()
export class AuthTokenService {
  static ONE_TIME_TOKEN_BYTES: number = 32;

  constructor(
    @Inject(securityConfig.KEY)
    private readonly securityConf: ConfigType<typeof securityConfig>,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly prismaService: PrismaService,
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
    const rawToken = randomBytes(AuthTokenService.ONE_TIME_TOKEN_BYTES).toString('base64url');
    const hashedToken = this.hashService.hash(rawToken);

    return { rawToken, hashedToken };
  }

  static calculateOneTimeTokenExpirationDate(expirationMs: number): Date {
    return new Date(Date.now() + expirationMs);
  }

  async fetchTokenContext(
    token: string,
    type: AuthTokenType,
    additionalAdminFields?: readonly (keyof AuthAdmin)[],
  ): Promise<OneTimeTokenContext> {
    const hashedToken: string = this.hashOneTimeToken(token);
    const adminFields: (keyof AuthAdmin)[] = [];
    let adminColumns: Partial<Record<keyof AuthAdmin, true>> = {};

    if (additionalAdminFields) adminFields.push(...additionalAdminFields);

    switch (type) {
      case 'REGISTER':
        if (!additionalAdminFields || !additionalAdminFields.includes('verification'))
          adminFields.push('verification');
        break;
    }

    const areAdminColumnsSelected: boolean = adminFields.length > 0;
    if (areAdminColumnsSelected) {
      adminColumns = adminFields.reduce(
        (acc, key) => {
          acc[key] = true;
          return acc;
        },
        {} as Partial<Record<keyof AuthAdmin, true>>,
      );
    }
    const tokenContext = await this.prismaService.authOneTimeToken.findUnique({
      where: { hashedToken, type },
      select: {
        hashedToken: true,
        expiresAt: true,
        adminId: true,
        admin: areAdminColumnsSelected ? { select: { ...adminColumns } } : false,
      },
    });

    if (!tokenContext)
      throw new BadRequestException('The provided one time token is invalid or does not exist');

    return tokenContext;
  }

  async validateOneTimeToken(
    tokenCtx: OneTimeTokenContext,
    tokenType: AuthTokenType,
  ): Promise<void> {
    if (tokenCtx.expiresAt < new Date()) {
      await this.deleteOneTimeTokenRecord(tokenCtx.adminId);
      throw new GoneException('Token expired');
    }
    if (tokenType === 'REGISTER' && tokenCtx.admin && tokenCtx.admin.verification !== 'WAITING') {
      await this.deleteOneTimeTokenRecord(tokenCtx.adminId);
      throw new UnprocessableEntityException({
        message: 'Account is not waiting for verification',
        reason: 'VERIFICATION_IS_NOT_CAPABLE',
      });
    }
  }

  private hashOneTimeToken(token: Base64URLString): string {
    return this.hashService.hash(token);
  }

  private async deleteOneTimeTokenRecord(adminId: number): Promise<void> {
    await this.prismaService.authOneTimeToken.delete({ where: { adminId } });
  }
}
