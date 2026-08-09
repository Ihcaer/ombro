import { AUTH_ROUTE_PREFIX } from '@core/auth/auth.constants';
import { LoginRequestDto, LoginResponseDto } from '@core/auth/dto';
import { AuthService } from '@core/auth/services/auth/auth.service';
import serverConfig from '@core/config/envs/server.config';
import { Body, Inject, Post, Res } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { Response } from 'express';
import { setRefreshTokenCookie } from './auth-controllers-functions';
import { PublicController } from '@core/auth/decorators';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { errorResponseExamples } from '@shared/swagger/error-response-examples.helper';

@ApiTags('Auth')
@PublicController(AUTH_ROUTE_PREFIX)
export class AuthPublicController {
  constructor(
    private readonly authService: AuthService,
    @Inject(serverConfig.KEY) private readonly serverConf: ConfigType<typeof serverConfig>,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Logs in the admin user' })
  @ApiCreatedResponse({
    description: 'Admin has been logged',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data (DTO validation).' })
  @ApiUnauthorizedResponse({
    content: errorResponseExamples([
      { errorCode: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' },
    ]),
  })
  @ApiForbiddenResponse({
    content: errorResponseExamples([
      {
        errorCode: 'EMAIL_NOT_VERIFIED',
        message:
          'Your email address has not been verified. Please check your inbox for the verification link.',
      },
    ]),
  })
  async login(
    @Body() requestDto: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const { adminData, refreshTokenData } = await this.authService.loginWithCredentials(requestDto);

    setRefreshTokenCookie(
      response,
      refreshTokenData.token,
      refreshTokenData.maxAge,
      this.serverConf.nodeEnv,
    );
    return adminData;
  }
}
