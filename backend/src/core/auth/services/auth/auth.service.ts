import {
  ForbiddenException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { AccessJwtPayload, RefreshJwtPayload } from '../../types/jwt.types';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { HashService } from '@shared/hash/hash.service';
import { AuthAdminRepository } from '../../auth-admin.repository';
import { TokenExpirationFactory } from '../../factories/token-expiration.factory';
import { SignInResponse, AdminData, Identifier } from '../../types/common.types';
import { LoginRequestDto } from '@core/auth/dto';
import { PASSWORD_SALT_ROUNDS } from '@core/auth/auth.constants';

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
  dummyHash: string;

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

    const { password: _password, ...adminWithoutPassword } = admin!;

    return this.issueTokens(adminWithoutPassword);
  }

  async loginWithRefreshToken(adminId: number, refreshToken: string): Promise<SignInResponse> {
    const now = new Date();
    const data = await this.adminRepository.findAdminAndRefreshTokensById(adminId);
    if (!data || data.refreshTokens.length === 0) throwLoginError();

    const { refreshTokens, ...admin } = data!;

    const isTokenValid: boolean = refreshTokens
      .filter((token) => token.expiresAt > now)
      .some((token) => this.hashService.compareHash(refreshToken, token.refreshTokenHash));
    if (!isTokenValid) throwLoginError();

    return this.issueTokens(admin);
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
