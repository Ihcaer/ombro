/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthRefreshController } from './auth-refresh.controller';
import { AuthService } from '@core/auth/services/auth/auth.service';
import { Response } from 'express';
import serverConfig from '@core/config/envs/server.config';
import { createServerConfigMock } from '@mocks/config/server.config.mock';
import { RefreshTokenWithAdmin } from '@core/auth/types/jwt.types';

describe('AuthRefreshController', () => {
  let controller: AuthRefreshController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthRefreshController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            loginWithRefreshToken: jest.fn(),
            logout: jest.fn(),
          },
        },
        { provide: serverConfig.KEY, useValue: createServerConfigMock() },
      ],
    }).compile();

    controller = module.get<AuthRefreshController>(AuthRefreshController);
    authService = module.get(AuthService);

    jest.clearAllMocks();
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
            avatarUrl: null,
            privileges: ['ADMINS_MANAGE'],
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
