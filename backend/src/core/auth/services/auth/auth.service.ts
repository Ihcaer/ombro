import {
  ForbiddenException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AccessJwtPayload,
  RefreshJwtPayload,
  RefreshTokenMetadata,
  RefreshTokenMetadataTable,
} from '../../types/jwt.types';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { HashService } from '@shared/hash/hash.service';
import { AuthAdminRepository } from '../../auth-admin.repository';
import { TokenExpirationFactory } from '../../factories/token-expiration.factory';
import { SignInResponse } from '../../types/common.types';
import { AdminAvatarUrlField, AdminData, Identifier } from '@core/auth/types/admin.types';
import { LoginRequestDto } from '@core/auth/dto';
import { PASSWORD_SALT_ROUNDS } from '@core/auth/auth.constants';
import { PrivilegesUtils } from '@core/auth/utils/privileges.utils';

const throwLoginError = (
  errorCode: string = 'INVALID_CREDENTIALS',
  message: string = 'Invalid credentials.',
): never => {
  throw new UnauthorizedException({ errorCode, message });
};

@Injectable()
export class AuthService implements OnModuleInit {
  static readonly ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 15; // in milliseconds
  static readonly REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // in milliseconds
  dummyHash!: string;

  constructor(
    private adminRepository: AuthAdminRepository,
    private tokenService: AuthTokenService,
    private hashService: HashService,
  ) {}

  async onModuleInit() {
    const dummyPassword = ' '.repeat(32);
    this.dummyHash = await this.hashService.hashBcrypt(dummyPassword, PASSWORD_SALT_ROUNDS);
  }

  async loginWithCredentials(dto: LoginRequestDto): Promise<SignInResponse> {
    const identifierType = AuthService.classifyIdentifier(dto.identifier);

    const admin = await this.adminRepository.findAdminByIdentifier(dto.identifier, identifierType);

    const passwordToCompare: string = admin?.password || this.dummyHash;
    const isPasswordValid: boolean = await this.hashService.compareBcrypt(
      dto.password,
      passwordToCompare,
    );

    if (admin && admin.verification !== 'VERIFIED') {
      throw new ForbiddenException({
        errorCode: 'EMAIL_NOT_VERIFIED',
        message:
          'Your email address has not been verified. Please check your inbox for the verification link.',
      });
    }
    if (!admin || !admin.password || !isPasswordValid) throwLoginError();

    const { password: _password, avatarFileId, ...adminWithoutPassword } = admin!;
    const avatarUrl: AdminAvatarUrlField['avatarUrl'] = avatarFileId === null ? avatarFileId : null;

    return this.issueTokens({ ...adminWithoutPassword, avatarUrl });
  }

  async loginWithRefreshToken(
    adminId: AdminData['id'],
    refreshToken: string,
  ): Promise<SignInResponse> {
    const data = await this.adminRepository.findAdminAndRefreshTokensById(adminId);
    if (!data || data.refreshTokens.length === 0) throwLoginError();

    const { refreshTokens, avatarFileId, ...admin } = data!;

    const avatarUrl: AdminAvatarUrlField['avatarUrl'] = avatarFileId === null ? avatarFileId : null;

    const activeTokens: RefreshTokenMetadataTable =
      AuthService.filterInactiveRefreshTokens(refreshTokens);
    const isTokenValid: boolean = activeTokens.some((token) =>
      this.hashService.compareHash(refreshToken, token.refreshTokenHash),
    );
    if (!isTokenValid) throwLoginError();

    return this.issueTokens({ ...admin, avatarUrl });
  }

  async logout(adminId: AdminData['id'], refreshToken: string): Promise<void> {
    const tokens = await this.adminRepository.findRefreshTokensByAdminId(adminId);
    if (!tokens) return;

    const activeTokens: RefreshTokenMetadataTable = AuthService.filterInactiveRefreshTokens(tokens);
    const currentSessionToken: RefreshTokenMetadata | undefined = activeTokens.find((token) =>
      this.hashService.compareHash(refreshToken, token.refreshTokenHash),
    );
    if (!currentSessionToken) return;

    await this.adminRepository.deleteRefreshTokenByHashAndAdminId(
      currentSessionToken.refreshTokenHash,
      adminId,
    );
  }

  private async issueTokens(
    admin: Omit<AdminData, 'avatarFileId'> & AdminAvatarUrlField,
  ): Promise<SignInResponse> {
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
      adminData: {
        accessToken: tokens.accessToken,
        adminData: {
          ...admin,
          privileges: PrivilegesUtils.bitmaskToArray(admin.privileges),
        },
      },
      refreshTokenData: {
        token: tokens.refreshToken,
        maxAge: tokenExpirationTimes.refreshExpiresInSec,
      },
    };
  }

  private static classifyIdentifier(identifier: string): Identifier {
    return identifier.includes('@') ? 'email' : 'handleName';
  }

  private static filterInactiveRefreshTokens(
    refreshTokens: RefreshTokenMetadataTable,
  ): RefreshTokenMetadataTable {
    const now = new Date();
    return refreshTokens.filter((token) => token.expiresAt > now);
  }
}
