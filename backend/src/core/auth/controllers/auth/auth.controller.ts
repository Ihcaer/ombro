import { AUTH_ROUTE_PREFIX, REFRESH_TOKEN_COOKIE_NAME } from '@core/auth/auth.constants';
import { LoginRequestDto, LoginResponseDto } from '@core/auth/dto';
import { RefreshTokenGuard } from '@core/auth/guards/refresh-token.guard';
import { AuthService } from '@core/auth/services/auth/auth.service';
import { SignInResponse } from '@core/auth/types/common.types';
import { RefreshTokenWithAdmin } from '@core/auth/types/jwt.types';
import serverConfig, { Environment } from '@core/config/envs/server.config';
import { Body, Controller, HttpCode, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { Request, Response } from 'express';

@Controller(AUTH_ROUTE_PREFIX)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(serverConfig.KEY) private readonly serverConf: ConfigType<typeof serverConfig>,
  ) {}

  @Post('login')
  async login(
    @Body() requestDto: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const { adminData, refreshTokenData } = await this.authService.loginWithCredentials(requestDto);

    this.setRefreshTokenCookie(response, refreshTokenData.token, refreshTokenData.maxAge);
    return adminData;
  }

  @Post('refresh')
  @HttpCode(200)
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const admin = req.user as RefreshTokenWithAdmin;

    const fullResponse: SignInResponse = await this.authService.loginWithRefreshToken(
      admin.id,
      admin.refreshToken,
    );

    this.setRefreshTokenCookie(
      res,
      fullResponse.refreshTokenData.token,
      fullResponse.refreshTokenData.maxAge,
    );
    return fullResponse.adminData;
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(RefreshTokenGuard)
  async logout(@Req() req: Request): Promise<void> {
    const admin = req.user as RefreshTokenWithAdmin;
    await this.authService.logout(admin.id, admin.refreshToken);
  }

  private setRefreshTokenCookie(res: Response, token: string, maxAge: number): void {
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: this.serverConf.nodeEnv === Environment.Production,
      sameSite: 'strict',
      maxAge: maxAge,
    });
  }
}
