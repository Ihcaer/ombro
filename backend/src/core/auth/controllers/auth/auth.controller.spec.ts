/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginRequestDto } from '@core/auth/dto';
import { AuthService } from '@core/auth/services/auth/auth.service';
import { RefreshTokenWithAdmin } from '@core/auth/types/jwt.types';
import { Response } from 'express';
import serverConfig from '@core/config/envs/server.config';
import { createServerConfigMock } from '@mocks/config/server.config.mock';

describe('LoginController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            loginWithCredentials: jest.fn(),
            loginWithRefreshToken: jest.fn(),
            logout: jest.fn(),
          },
        },
        { provide: serverConfig.KEY, useValue: createServerConfigMock() },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);

    jest.clearAllMocks();
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
          accessToken: 'access-token',
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
          secure: false,
          sameSite: 'strict',
        }),
      );
      expect(result.accessToken).toBe('access-token');
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
          accessToken: 'access-token',
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

      expect(authService.loginWithRefreshToken).toHaveBeenCalledWith(1, 'refresh-token');
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'new-refresh-token',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
        }),
      );
      expect(result.accessToken).toBe('access-token');
    });
  });
});
