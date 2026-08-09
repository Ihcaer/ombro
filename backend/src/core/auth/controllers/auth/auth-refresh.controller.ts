import { LoginResponseDto } from '@core/auth/dto';
import { AuthService } from '@core/auth/services/auth/auth.service';
import { SignInResponse } from '@core/auth/types/common.types';
import { RefreshTokenWithAdmin } from '@core/auth/types/jwt.types';
import { HttpCode, Inject, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { setRefreshTokenCookie } from './auth-controllers-functions';
import serverConfig from '@core/config/envs/server.config';
import type { ConfigType } from '@nestjs/config';
import { RefreshController } from '@core/auth/decorators';
import { AUTH_ROUTE_PREFIX, REFRESH_TOKEN_COOKIE_NAME } from '@core/auth/auth.constants';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { errorResponseExamples } from '@shared/swagger/error-response-examples.helper';

@ApiTags('Auth')
@ApiCookieAuth(REFRESH_TOKEN_COOKIE_NAME)
@RefreshController(AUTH_ROUTE_PREFIX)
export class AuthRefreshController {
  constructor(
    private readonly authService: AuthService,
    @Inject(serverConfig.KEY) private readonly serverConf: ConfigType<typeof serverConfig>,
  ) {}

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Refreshes the admin session' })
  @ApiOkResponse({ description: 'Refreshed the admin session', type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid input data (DTO validation).' })
  @ApiUnauthorizedResponse({
    content: errorResponseExamples([
      { errorCode: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' },
    ]),
  })
  @ApiForbiddenResponse({ description: 'Not verified email.' })
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const admin = req.user as RefreshTokenWithAdmin;

    const fullResponse: SignInResponse = await this.authService.loginWithRefreshToken(
      admin.id,
      admin.refreshToken,
    );

    setRefreshTokenCookie(
      res,
      fullResponse.refreshTokenData.token,
      fullResponse.refreshTokenData.maxAge,
      this.serverConf.nodeEnv,
    );
    return fullResponse.adminData;
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({ summary: 'Admin log out' })
  @ApiNoContentResponse({ description: 'The admin has been successfully logged out' })
  @ApiBadRequestResponse({ description: 'Invalid input data (DTO validation).' })
  async logout(@Req() req: Request): Promise<void> {
    const admin = req.user as RefreshTokenWithAdmin;
    await this.authService.logout(admin.id, admin.refreshToken);
  }
}
