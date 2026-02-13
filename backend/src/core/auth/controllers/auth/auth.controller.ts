import { AUTH_ROUTE_PREFIX } from '@core/auth/auth.constants';
import { LoginRequestDto, LoginResponseDto } from '@core/auth/dto';
import { RefreshTokenGuard } from '@core/auth/guards/refresh-token.guard';
import { AuthService } from '@core/auth/services/auth/auth.service';
import { SignInResponse } from '@core/auth/types/common.types';
import { RefreshTokenWithAdmin } from '@core/auth/types/jwt.types';
import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller(AUTH_ROUTE_PREFIX)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() requestDto: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const { adminData, refreshTokenData } = await this.authService.loginWithCredentials(requestDto);

    response.cookie('refresh_token', refreshTokenData.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: refreshTokenData.maxAge,
    });
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

    res.cookie('refresh_token', fullResponse.refreshTokenData.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: fullResponse.refreshTokenData.maxAge,
    });
    return fullResponse.adminData;
  }
}
