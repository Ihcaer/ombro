import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import type { Request, Response } from 'express';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RefreshTokenWithAdmin } from './types/jwt.types';
import { SignInResponse } from './types/common.types';
import { Auth } from './decorators/auth.decorator';
import { AdminPrivileges } from './enums/admin-privileges';
import { AdminRegistrationService } from './services/admin-registration/admin-registration.service';
import {
  ConfirmAdminAccountFormFieldDto,
  ConfirmAdminRequestDto,
  CreateAdminRequestDto,
  CreateAdminResponseDto,
  FieldsToConfirmAccountRequestDto,
  LoginRequestDto,
  LoginResponseDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminRegistrationService: AdminRegistrationService,
  ) {}

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

  @Post('create-admin')
  @Auth(AdminPrivileges.ADMINS_MANAGE)
  async createAdmin(@Body() dto: CreateAdminRequestDto): Promise<CreateAdminResponseDto> {
    return await this.adminRegistrationService.createAdminAccount(dto);
  }

  @Get('confirm-account-form/:token')
  async getFieldsToConfirmAccount(
    @Param() params: FieldsToConfirmAccountRequestDto,
  ): Promise<ConfirmAdminAccountFormFieldDto> {
    return await this.adminRegistrationService.getFormFieldsToConfirm(params.token);
  }

  @Patch('confirm-admin')
  @HttpCode(204)
  async confirmAdmin(@Body() requestDto: ConfirmAdminRequestDto): Promise<void> {
    await this.adminRegistrationService.accountConfirmation(requestDto);
  }
}
