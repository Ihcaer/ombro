/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth/auth.service';
import { Response } from 'express';
import { RefreshTokenWithAdmin } from './types/jwt.types';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { AdminRegistrationService } from './services/admin-registration/admin-registration.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  // let adminManagementService: jest.Mocked<AdminManagementService>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            loginWithCredentials: jest.fn(),
            loginWithRefreshToken: jest.fn(),
          },
        },
        {
          provide: AdminRegistrationService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    // adminManagementService = module.get(AdminManagementService);
  });

  describe('.login()', () => {
    it('should give access token and user data in response and refresh token in cookie', async () => {
      const body: LoginRequestDto = {
        identifier: 'handle',
        password: 'test-password',
      };
      const res = { cookie: jest.fn() } as unknown as Response;

      authService.loginWithCredentials.mockResolvedValue({
        adminData: {
          jwt: 'access-token',
          adminData: {
            id: 1,
            handleName: 'handle',
            displayName: 'name',
            avatarId: 1,
            privileges: 1,
            verification: 'VERIFIED',
            isActivated: true,
          },
        },
        refreshTokenData: {
          token: 'new-refresh-token',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
      });

      const result = await controller.login({ ...body }, res);

      expect(authService.loginWithCredentials).toHaveBeenCalledWith({
        ...body,
      });
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'new-refresh-token',
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        }),
      );
      expect(result.jwt).toBe('access-token');
    });
  });
  describe('.refreshTokens()', () => {
    it('should refresh tokens and set cookie', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const req = {
        user: {
          id: 1,
          refreshToken: 'refresh-token',
        } satisfies RefreshTokenWithAdmin,
      } as any;
      const res = { cookie: jest.fn() } as unknown as Response;

      authService.loginWithRefreshToken.mockResolvedValue({
        adminData: {
          jwt: 'access-token',
          adminData: {
            id: 1,
            handleName: 'handle',
            displayName: 'name',
            avatarId: 1,
            privileges: 1,
            verification: 'VERIFIED',
            isActivated: true,
          },
        },
        refreshTokenData: {
          token: 'new-refresh-token',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await controller.refreshTokens(req, res);

      expect(authService.loginWithRefreshToken).toHaveBeenCalledWith(
        1,
        'refresh-token',
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'new-refresh-token',
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        }),
      );
      expect(result.jwt).toBe('access-token');
    });
  });
});
