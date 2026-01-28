import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessJwtPayload, RefreshJwtPayload } from '../../types/jwt.types';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { HashService } from '@shared/hash/hash.service';
import { AuthAdminRepository } from '../../auth-admin.repository';
import { TokenExpirationFactory } from '../../factories/token-expiration.factory';
import {
  SignInResponse,
  AdminData,
  Identifier,
} from '../../types/common.types';
import { LoginRequestDto } from '@core/auth/dto';

const throwLoginError = (message?: string): never => {
  throw new UnauthorizedException(message || 'Invalid credentials');
};

@Injectable()
export class AuthService {
  static readonly ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 15; // in milliseconds
  static readonly REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // in milliseconds

  constructor(
    private adminRepository: AuthAdminRepository,
    private tokenService: AuthTokenService,
    private hashService: HashService,
  ) {}

  async loginWithCredentials(dto: LoginRequestDto): Promise<SignInResponse> {
    const identifierType = AuthService.classifyIdentifier(dto.identifier);

    const admin = await this.adminRepository.findByIdentifier(
      dto.identifier,
      identifierType,
    );
    if (!admin || !admin.password) throwLoginError();
    if (!admin?.isActivated) throwLoginError('Account is inactive');
    if (!admin?.handleName && admin?.verification !== 'VERIFIED')
      throwLoginError('No handle name. Please contact with administrator');

    const { password, ...adminWithoutPassword } = admin!;

    const isPasswordValid: boolean = await this.hashService.compareBcrypt(
      dto.password,
      password!,
    );
    if (!isPasswordValid) throwLoginError();

    return this.issueTokens(adminWithoutPassword);
  }

  async loginWithRefreshToken(
    adminId: number,
    refreshToken: string,
  ): Promise<SignInResponse> {
    const data =
      await this.adminRepository.findAdminAndRefreshTokenById(adminId);
    if (!data) throwLoginError();

    const isTokenValid: boolean = this.hashService.compareHash(
      refreshToken,
      data!.refreshTokenHash,
    );
    if (!isTokenValid) throwLoginError();

    return this.issueTokens(data!.admin);
  }

  private async issueTokens(admin: AdminData): Promise<SignInResponse> {
    const tokenExpirationTimes = TokenExpirationFactory.create();
    const accessPayload: AccessJwtPayload = {
      id: admin.id,
      privileges: admin.privileges,
      verification: admin.verification,
      isActivated: admin.isActivated,
    };
    const refreshPayload: RefreshJwtPayload = { id: admin.id };

    const tokens = await this.tokenService.generateTokens(
      accessPayload,
      refreshPayload,
      tokenExpirationTimes,
    );

    await this.adminRepository.saveRefreshToken(
      admin.id,
      this.tokenService.hashRefreshToken(tokens.refreshToken),
      tokenExpirationTimes.refreshExpiresAt,
    );

    return {
      adminData: { jwt: tokens.accessToken, adminData: admin },
      refreshTokenData: {
        token: tokens.refreshToken,
        maxAge: tokenExpirationTimes.refreshExpiresInSec,
      },
    };
  }

  private static classifyIdentifier(identifier: string): Identifier {
    return identifier.includes('@') ? 'email' : 'handleName';
  }
}
