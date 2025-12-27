/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '@app-prisma/prisma.service';
import { HashService } from '@common/hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { AdminDto } from './dto/admin.dto';
import { SignInResponse } from './types/sign-in-response.type';
import { AuthJwtTokens, TokensExpirationTimes } from './types/jwt.type';
import { JwtPayload } from './types/jwt-payload.type';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let hashService: HashService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: { authAdmin: { update: jest.fn(), findUnique: jest.fn() } },
        },
        {
          provide: HashService,
          useValue: {
            hashBcrypt: jest.fn(),
            compareBcrypt: jest.fn(),
            hash: jest.fn(),
          },
        },
        { provide: JwtService, useValue: { signAsync: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    hashService = module.get<HashService>(HashService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('.signIn()', () => {
    let adminCredentials: Readonly<LoginRequestDto>;
    let mockExistingAdmin: Readonly<AdminDto>;
    let refreshJwtHash: Readonly<string>;
    let tokens: Readonly<AuthJwtTokens>;
    let updatedLastLogged: Readonly<Date>;

    beforeAll(() => {
      adminCredentials = {
        identifier: 'testHandle',
        password: 'test-password',
      };
      mockExistingAdmin = {
        id: 1,
        displayName: 'Name',
        handleName: 'handle',
        password: 'hashed_password',
        avatarId: 1,
        privileges: 1,
        verification: 'VERIFIED',
        isActivated: true,
      };
      refreshJwtHash = 'hashedRefreshJwt';
      tokens = { accessToken: 'accessJwt', refreshToken: 'refreshJwt' };
      updatedLastLogged = new Date();
    });
    beforeEach(() => {
      (configService.get as jest.Mock).mockReturnValue('jwt-secret');
      (hashService.hash as jest.Mock).mockReturnValue(refreshJwtHash);
      (jwtService.signAsync as jest.Mock)
        .mockResolvedValueOnce(tokens.accessToken)
        .mockResolvedValueOnce(tokens.refreshToken);
      (prisma.authAdmin.findUnique as jest.Mock).mockResolvedValue(
        mockExistingAdmin,
      );
      (hashService.compareBcrypt as jest.Mock).mockResolvedValue(true);
      (prisma.authAdmin.update as jest.Mock).mockResolvedValue(
        updatedLastLogged,
      );
    });
    it('should return admin data successful if credentials are correct (with handle)', async () => {
      const result: SignInResponse = await service.signIn(adminCredentials);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...expectedAdminData } = mockExistingAdmin;
      const expectedResult: SignInResponse = {
        adminData: {
          jwt: tokens.accessToken,
          adminData: expectedAdminData,
        },
        refreshTokenData: {
          token: tokens.refreshToken,
          maxAge: AuthService.REFRESH_TOKEN_EXPIRATION * 60 * 1000,
        },
      };

      expect(prisma.authAdmin.findUnique).toHaveBeenCalledWith({
        where: { handleName: adminCredentials.identifier },
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
      expect(prisma.authAdmin.update).toHaveBeenCalledWith({
        where: { id: mockExistingAdmin.id },
        data: {
          lastLogged: expect.any(Date) as unknown,
          refreshToken: {
            create: {
              refreshTokenHash: refreshJwtHash,
              expiresAt: expect.any(Date) as unknown,
            },
          },
        },
        select: { lastLogged: true },
      });
      expect(result).toStrictEqual(expectedResult);
    });
  });
  describe('.getTokens()', () => {
    let tokensExpirationTimes: Readonly<TokensExpirationTimes>;
    let payload: Readonly<JwtPayload>;
    let jwtSecrets: { access: string; refresh: string };
    let tokens: Readonly<AuthJwtTokens>;

    const calculateExpirationTime = (minutes: number): number =>
      Math.floor(Date.now() / 1000) + 60 * minutes;

    beforeAll(() => {
      jwtSecrets = {
        access: 'access-secret-key',
        refresh: 'refresh-secret-key',
      };
      tokens = { accessToken: 'accessJwt', refreshToken: 'refreshJwt' };
    });
    beforeEach(() => {
      // (configService.get as jest.Mock).mockReturnValue('jwt-secret');
      (configService.get as jest.Mock)
        .mockReturnValueOnce(jwtSecrets.access)
        .mockReturnValueOnce(jwtSecrets.refresh);
    });
    it('should been works correctly if data are valid', async () => {
      payload = {
        id: 1,
        privileges: 1,
        verification: 'VERIFIED',
        isActivated: true,
      };
      tokensExpirationTimes = {
        accessExpiration: calculateExpirationTime(1),
        refreshExpiration: calculateExpirationTime(2),
      };

      (jwtService.signAsync as jest.Mock)
        .mockResolvedValueOnce(tokens.accessToken)
        .mockResolvedValueOnce(tokens.refreshToken);

      const result = await service.getTokens(payload, tokensExpirationTimes);

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(
        1,
        payload,
        expect.objectContaining({
          secret: jwtSecrets.access,
          expiresIn: tokensExpirationTimes.accessExpiration,
        }),
      );
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        payload,
        expect.objectContaining({
          secret: jwtSecrets.refresh,
          expiresIn: tokensExpirationTimes.refreshExpiration,
        }),
      );
      expect(result).toStrictEqual({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    });
    it('should throw an error if accessToken generation fails', async () => {
      (jwtService.signAsync as jest.Mock)
        .mockRejectedValueOnce(new Error('JWT Error'))
        .mockResolvedValueOnce('refresh-token');

      await expect(
        service.getTokens(payload, tokensExpirationTimes),
      ).rejects.toThrow('JWT Error');
    });
    it('should not modify original payload object', async () => {
      const originalPayload = { id: 1 };
      const payloadCopy = { ...originalPayload };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await service.getTokens(payloadCopy as any, tokensExpirationTimes);
      expect(payloadCopy).toEqual(originalPayload);
    });
  });
});
