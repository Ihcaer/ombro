/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginRequestDto } from '../../dto/login-request.dto';
import { AdminWithPassword } from '@core/auth/auth-admin.repository';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { HashService } from '@shared/hash/hash.service';
import { AuthAdminRepository } from '../../auth-admin.repository';
import { AuthRefreshToken, AuthVerification } from '@generated/prisma-client';

describe('AuthService', () => {
  let service: AuthService;
  let adminRepository: jest.Mocked<AuthAdminRepository>;
  let tokenService: jest.Mocked<AuthTokenService>;
  let hashService: jest.Mocked<HashService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthAdminRepository,
          useValue: {
            findAdminByIdentifier: jest.fn(),
            findAdminAndRefreshTokensById: jest.fn(),
            saveRefreshToken: jest.fn(),
          },
        },
        {
          provide: AuthTokenService,
          useValue: { generateTokens: jest.fn(), hashRefreshToken: jest.fn() },
        },
        {
          provide: HashService,
          useValue: {
            compareBcrypt: jest.fn(),
            compareHash: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    adminRepository = module.get(AuthAdminRepository);
    tokenService = module.get(AuthTokenService);
    hashService = module.get(HashService);

    jest.clearAllMocks();
  });

  describe('login methods', () => {
    let adminInDb: AdminWithPassword | null;
    let jwtTokensValue: { accessToken: string; refreshToken: string };
    let refreshTokenHash: string;

    beforeEach(() => {
      adminInDb = {
        id: 1,
        handleName: 'handle',
        displayName: 'name',
        password: 'test-password',
        avatarFileId: 1,
        privileges: 1,
        verification: 'VERIFIED',
        isActivated: true,
      };
      jwtTokensValue = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      refreshTokenHash = 'refresh-token-hash';

      tokenService.generateTokens.mockResolvedValue({ ...jwtTokensValue });
      tokenService.hashRefreshToken.mockReturnValue(refreshTokenHash);
    });

    describe('.loginWithCredentials()', () => {
      let loginCredentials: LoginRequestDto;

      it('should login successfully', async () => {
        const admin = { ...adminInDb } as AdminWithPassword;
        loginCredentials = {
          identifier: admin.handleName!,
          password: admin.password!,
        };

        adminRepository.findAdminByIdentifier.mockResolvedValue(admin);
        hashService.compareBcrypt.mockResolvedValue(loginCredentials.password === admin.password);

        const result = await service.loginWithCredentials(loginCredentials);

        expect(adminRepository.saveRefreshToken).toHaveBeenCalled();
        expect(result.adminData.accessToken).toBe(jwtTokensValue.accessToken);
      });

      it('should throw on invalid password', async () => {
        const admin = { ...adminInDb } as AdminWithPassword;
        loginCredentials = {
          identifier: admin.handleName!,
          password: 'wrong-password',
        };

        adminRepository.findAdminByIdentifier.mockResolvedValue(admin);
        hashService.compareBcrypt.mockResolvedValue(loginCredentials.password === admin.password);

        await expect(service.loginWithCredentials(loginCredentials)).rejects.toThrow(
          UnauthorizedException,
        );
      });

      it('should throw when admin account is not verified', async () => {
        const admin = { ...adminInDb } as AdminWithPassword;
        Object.assign(admin, { password: null, verification: AuthVerification.WAITING });
        loginCredentials = {
          identifier: admin.handleName!,
          password: 'password',
        };

        adminRepository.findAdminByIdentifier.mockResolvedValue(admin);
        hashService.compareBcrypt.mockResolvedValue(loginCredentials.password !== admin.password);

        await expect(service.loginWithCredentials(loginCredentials)).rejects.toThrow(
          ForbiddenException,
        );
      });
    });

    describe('.loginWithRefreshToken()', () => {
      let methodPayload: { adminId: number; refreshToken: string };
      let admin: AdminWithPassword;
      let refreshTokens: Pick<AuthRefreshToken, 'refreshTokenHash' | 'expiresAt'>[];

      beforeEach(() => {
        admin = { ...adminInDb } as AdminWithPassword;

        methodPayload = {
          adminId: admin.id,
          refreshToken: 'old-refresh-token',
        };
        refreshTokens = [
          {
            refreshTokenHash: 'refresh-token-hash',
            expiresAt: new Date(new Date(new Date().getTime() + 24 * 60 * 1000).toISOString()),
          },
        ];
      });

      it('should refresh tokens successfully', async () => {
        adminRepository.findAdminAndRefreshTokensById.mockResolvedValue({
          ...admin,
          refreshTokens,
        });
        hashService.compareHash.mockReturnValueOnce(true).mockReturnValue(false);

        const result = await service.loginWithRefreshToken(
          methodPayload.adminId,
          methodPayload.refreshToken,
        );

        expect(result.adminData.accessToken).toBe(jwtTokensValue.accessToken);
      });

      it('should throw when id is wrong', async () => {
        adminRepository.findAdminAndRefreshTokensById.mockResolvedValue(null);

        await expect(
          service.loginWithRefreshToken(methodPayload.adminId, methodPayload.refreshToken),
        ).rejects.toThrow(UnauthorizedException);
      });

      it('should throw on invalid refresh token', async () => {
        const adminAndRefreshTokenFromDb = {
          ...admin,
          refreshTokens: [...refreshTokens],
        };
        adminRepository.findAdminAndRefreshTokensById.mockResolvedValue(adminAndRefreshTokenFromDb);
        hashService.compareHash.mockReturnValue(false);

        await expect(
          service.loginWithRefreshToken(methodPayload.adminId, methodPayload.refreshToken),
        ).rejects.toThrow(UnauthorizedException);
      });
    });
  });
});
