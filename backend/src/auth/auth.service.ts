import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { PrismaService } from '@app-prisma/prisma.service';
import { Prisma } from '@generated/prisma-client';
import { AdminDto } from './dto/admin.dto';
import { HashService } from '@common/hash/hash.service';
import { JwtPayload } from './types/jwt-payload.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthJwtTokens, TokensExpirationTimes } from './types/jwt.type';
import { SignInResponse } from './types/sign-in-response.type';

type Identifier = 'email' | 'handleName';

const throwLoginError = (message?: string): never => {
  throw new UnauthorizedException(message || 'Invalid credentials');
};

const calculateExpirationTime = (minutes: number): number =>
  Math.floor(Date.now() / 1000) + 60 * minutes;

@Injectable()
export class AuthService {
  static readonly ACCESS_TOKEN_EXPIRATION = 15; // in minutes
  static readonly REFRESH_TOKEN_EXPIRATION = 60 * 24 * 7; // in minutes

  constructor(
    private prisma: PrismaService,
    private hashService: HashService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(
    loginCredentials: Readonly<LoginRequestDto>,
  ): Promise<SignInResponse> {
    const identifierType: Identifier = AuthService.classifyIdentifier(
      loginCredentials.identifier,
    );

    // get admin's data
    const admin: AdminDto = await this.getAdmin(
      loginCredentials.identifier,
      identifierType,
    );
    const { password, ...adminWithoutPassword } = admin;

    // check password
    const isPasswordCorrect: boolean = await this.checkPassword(
      loginCredentials.password,
      password,
    );
    if (!isPasswordCorrect) throwLoginError();

    // generate jwt tokens
    const tokensExpirationTimes: TokensExpirationTimes = {
      accessExpiration: calculateExpirationTime(
        AuthService.ACCESS_TOKEN_EXPIRATION,
      ),
      refreshExpiration: calculateExpirationTime(
        AuthService.REFRESH_TOKEN_EXPIRATION,
      ),
    };
    const authTokens: AuthJwtTokens = await this.getTokens(
      {
        id: admin.id,
        privileges: admin.privileges,
        verification: admin.verification,
        isActivated: admin.isActivated,
      },
      tokensExpirationTimes,
    );

    // hash refresh jwt and save in db and update lastLogged
    const refreshTokenHash: string = this.hashService.hash(
      authTokens.refreshToken,
    );
    await this.updateLastLoggedAndToken(
      admin.id,
      refreshTokenHash,
      tokensExpirationTimes.refreshExpiration,
    );

    // return jwt and admin data
    const { accessToken, refreshToken } = authTokens;
    return {
      adminData: { jwt: accessToken, adminData: adminWithoutPassword },
      refreshTokenData: {
        token: refreshToken,
        maxAge: AuthService.REFRESH_TOKEN_EXPIRATION * 60 * 1000, // in milliseconds
      },
    };
  }

  async getTokens(
    payload: Readonly<JwtPayload>,
    expirationTimes: TokensExpirationTimes,
  ): Promise<AuthJwtTokens> {
    const tokensSecrets = {
      accessSecret: this.configService.get<string>('jwtAccessSecret'),
      refreshSecret: this.configService.get<string>('jwtRefreshSecret'),
    };
    if (!tokensSecrets.accessSecret || !tokensSecrets.refreshSecret) {
      console.error('Jwt secrets are missing');
      throw new InternalServerErrorException();
    }

    const tokensExpiration = {
      accessExpiration: expirationTimes.accessExpiration,
      refreshExpiration: expirationTimes.refreshExpiration,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: tokensSecrets.accessSecret,
        expiresIn: tokensExpiration.accessExpiration,
      }),
      this.jwtService.signAsync(payload, {
        secret: tokensSecrets.refreshSecret,
        expiresIn: tokensExpiration.refreshExpiration,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async updateLastLoggedAndToken(
    id: number,
    refreshTokenHash: string,
    refreshTokenExpiration: number,
  ): Promise<void> {
    try {
      await this.prisma.authAdmin.update({
        where: { id: id },
        data: {
          lastLogged: new Date(),
          refreshToken: {
            create: {
              refreshTokenHash: refreshTokenHash,
              expiresAt: new Date(refreshTokenExpiration * 1000),
            },
          },
        },
        select: { lastLogged: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          console.error('No admin with the specified ID was found.');
        }
        if (error.code === 'P2003') {
          console.error(
            'Foreign key constraint failed: The provided relation ID does not exist.',
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  private async checkPassword(
    clientValue: string,
    dbValue: string,
  ): Promise<boolean> {
    const isCorrect: boolean = await this.hashService.compareBcrypt(
      clientValue,
      dbValue,
    );
    return isCorrect;
  }

  private async getAdmin(
    identifier: string,
    identifierType: Identifier,
  ): Promise<AdminDto> {
    const whereClause = {
      [identifierType]: identifier,
    } as unknown as Prisma.AuthAdminWhereUniqueInput;

    const admin = await this.prisma.authAdmin.findUnique({
      where: whereClause,
      select: {
        id: true,
        displayName: true,
        handleName: true,
        password: true,
        avatarId: true,
        privileges: true,
        verification: true,
        isActivated: true,
      },
    });

    if (!admin || !admin.password) throwLoginError();
    if (!admin?.isActivated)
      throwLoginError('Your account is inactive. Contact with administrator');

    return admin as AdminDto;
  }

  private static classifyIdentifier(identifier: string): Identifier {
    const isEmail: boolean =
      identifier.includes('@') && identifier.includes('.');

    if (isEmail) {
      return 'email';
    } else {
      return 'handleName';
    }
  }
}
