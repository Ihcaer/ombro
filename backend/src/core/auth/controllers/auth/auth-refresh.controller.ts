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
import { AUTH_ROUTE_PREFIX } from '@core/auth/auth.constants';

@RefreshController(AUTH_ROUTE_PREFIX)
export class AuthRefreshController {
  constructor(
    private readonly authService: AuthService,
    @Inject(serverConfig.KEY) private readonly serverConf: ConfigType<typeof serverConfig>,
  ) {}

  @Post('refresh')
  @HttpCode(200)
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
  async logout(@Req() req: Request): Promise<void> {
    const admin = req.user as RefreshTokenWithAdmin;
    await this.authService.logout(admin.id, admin.refreshToken);
  }
}
