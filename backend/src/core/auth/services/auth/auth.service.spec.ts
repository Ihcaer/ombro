/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginRequestDto } from '../../dto/loginRequest.dto';
import { AdminDto } from '../../dto/admin.dto';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { UnauthorizedException } from '@nestjs/common';
import { HashService } from '@shared/hash/hash.service';
import { AuthAdminRepository } from '../../auth-admin.repository';

describe('AuthService', () => {
  let service: AuthService;
  let adminRepository: jest.Mocked<AuthAdminRepository>;
  let tokenService: jest.Mocked<AuthTokenService>;
  let hashService: jest.Mocked<HashService>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthAdminRepository,
          useValue: {
            findByIdentifier: jest.fn(),
            findAdminAndRefreshTokenById: jest.fn(),
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
  });

  describe('login methods', () => {
    let adminInDb: AdminDto | null;
    let jwtTokensValue: { accessToken: string; refreshToken: string };
    let refreshTokenHash: string;

    beforeEach(() => {
      adminInDb = {
        id: 1,
        handleName: 'handle',
        displayName: 'name',
        password: 'test-password',
        avatarId: 1,
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
        const admin = { ...adminInDb } as AdminDto;
        loginCredentials = {
          identifier: admin.handleName!,
          password: admin.password!,
        };

        adminRepository.findByIdentifier.mockResolvedValue(admin);
        hashService.compareBcrypt.mockResolvedValue(
          loginCredentials.password === admin.password,
        );

        const result = await service.loginWithCredentials(loginCredentials);

        expect(adminRepository.saveRefreshToken).toHaveBeenCalled();
        expect(result.adminData.jwt).toBe(jwtTokensValue.accessToken);
      });

      it('should throw on invalid password', async () => {
        const admin = { ...adminInDb } as AdminDto;
        loginCredentials = {
          identifier: admin.handleName!,
          password: 'wrong-password',
        };

        adminRepository.findByIdentifier.mockResolvedValue(admin);
        hashService.compareBcrypt.mockResolvedValue(
          loginCredentials.password === admin.password,
        );

        await expect(
          service.loginWithCredentials(loginCredentials),
        ).rejects.toThrow(UnauthorizedException);
      });

      it('should throw when admin account is disabled', async () => {
        const admin = { ...adminInDb } as AdminDto;
        Object.assign(admin, { isActivated: false });
        loginCredentials = {
          identifier: admin.handleName!,
          password: admin.password!,
        };

        adminRepository.findByIdentifier.mockResolvedValue(admin);
        hashService.compareBcrypt.mockResolvedValue(
          loginCredentials.password === admin.password,
        );

        await expect(
          service.loginWithCredentials(loginCredentials),
        ).rejects.toThrow(UnauthorizedException);
      });
    });

    describe('.loginWithRefreshToken()', () => {
      let methodPayload: { adminId: number; refreshToken: string };
      let admin: AdminDto;

      beforeEach(() => {
        admin = { ...adminInDb } as AdminDto;
        methodPayload = {
          adminId: admin.id,
          refreshToken: 'old-refresh-token',
        };
      });

      it('should refresh tokens successfully', async () => {
        adminRepository.findAdminAndRefreshTokenById.mockResolvedValue({
          admin,
          refreshTokenHash,
        });
        hashService.compareHash.mockReturnValue(true);

        const result = await service.loginWithRefreshToken(
          methodPayload.adminId,
          methodPayload.refreshToken,
        );

        expect(result.adminData.jwt).toBe(jwtTokensValue.accessToken);
      });

      it('should throw when id is wrong', async () => {
        adminRepository.findAdminAndRefreshTokenById.mockResolvedValue(null);

        await expect(
          service.loginWithRefreshToken(
            methodPayload.adminId,
            methodPayload.refreshToken,
          ),
        ).rejects.toThrow(UnauthorizedException);
      });

      it('should throw on invalid refresh token', async () => {
        adminRepository.findAdminAndRefreshTokenById.mockResolvedValue({
          admin,
          refreshTokenHash,
        });
        hashService.compareHash.mockReturnValue(false);

        await expect(
          service.loginWithRefreshToken(
            methodPayload.adminId,
            methodPayload.refreshToken,
          ),
        ).rejects.toThrow(UnauthorizedException);
      });
    });
  });
});
