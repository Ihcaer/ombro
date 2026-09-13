/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthPublicController } from './auth-public.controller';
import { LoginRequestDto } from '@core/auth/dto';
import { AuthService } from '@core/auth/services/auth/auth.service';
import { Response } from 'express';
import serverConfig from '@core/config/envs/server.config';
import { createServerConfigMock } from '@mocks/config/server.config.mock';
import { DEFAULT_ADMIN_PREFERENCES } from '@core/auth/auth.constants';

describe('LoginPublicController', () => {
  let controller: AuthPublicController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthPublicController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            loginWithCredentials: jest.fn(),
          },
        },
        { provide: serverConfig.KEY, useValue: createServerConfigMock() },
      ],
    }).compile();

    controller = module.get<AuthPublicController>(AuthPublicController);
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
            avatarUrl: null,
            privileges: ['ADMINS_MANAGE'],
            verification: 'VERIFIED',
            isActivated: true,
            preferences: DEFAULT_ADMIN_PREFERENCES,
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
});
