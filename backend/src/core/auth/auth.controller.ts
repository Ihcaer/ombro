import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { AuthService } from './services/auth.service';
import type { Request, Response } from 'express';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RefreshTokenWithAdmin } from './types/jwt.types';
import { SignInResponse } from './types/common.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() requestDto: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const { adminData, refreshTokenData } =
      await this.authService.loginWithCredentials(requestDto);

    response.cookie('refresh_token', refreshTokenData.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: refreshTokenData.maxAge,
    });
    return adminData;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const admin = req.user as RefreshTokenWithAdmin;

    const fullResponse: SignInResponse =
      await this.authService.loginWithRefreshToken(
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
