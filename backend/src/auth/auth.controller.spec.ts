import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { Response } from 'express';
import { SignInResponse } from './types/sign-in-response.type';

describe('AuthController', () => {
  let controller: AuthController;
  let mockResponse: Response;

  const mockAuthService = { signIn: jest.fn() };

  beforeEach(async () => {
    jest.restoreAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    mockResponse = {
      cookie: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  describe('.login()', () => {
    it('should call authService.signIn with correct credentials and return data', async () => {
      const adminCredentials: LoginRequestDto = {
        identifier: 'handle',
        password: 'testPassword',
      };
      const serviceExpectedResult: SignInResponse = {
        adminData: {
          jwt: 'test-jwt',
          adminData: {
            id: 1,
            displayName: 'name',
            handleName: 'handle',
            avatarId: 1,
            privileges: 1,
            verification: 'VERIFIED',
            isActivated: true,
          },
        },
        refreshTokenData: {
          token: 'refresh-token',
          maxAge: 60 * 24 * 7 * 60 * 1000,
        },
      };

      mockAuthService.signIn.mockResolvedValue(serviceExpectedResult);
      const cookieSpy = jest.spyOn(mockResponse, 'cookie');

      const result = await controller.login(adminCredentials, mockResponse);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(adminCredentials);
      expect(cookieSpy).toHaveBeenCalledWith(
        'refresh_token',
        serviceExpectedResult.refreshTokenData.token,
        {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: serviceExpectedResult.refreshTokenData.maxAge,
        },
      );

      expect(result).toEqual(serviceExpectedResult.adminData);
    });

    it('should throw an error if service throws', async () => {
      const adminCredentials: LoginRequestDto = {
        identifier: 'wrong-handle',
        password: 'test-password',
      };
      const errorContent = 'Wrong credentials';

      mockAuthService.signIn.mockRejectedValue(new Error(errorContent));
      await expect(
        controller.login(adminCredentials, mockResponse),
      ).rejects.toThrow(errorContent);
    });
  });
});
