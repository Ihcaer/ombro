import { AUTH_ROUTE_PREFIX } from '@core/auth/auth.constants';
import { ResetPasswordRequestDto } from '@core/auth/dto';
import { ForgotPasswordRequestDto } from '@core/auth/dto/forgot-password-request.dto';
import { PasswordResetService } from '@core/auth/services/password-reset/password-reset.service';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';

@Controller(AUTH_ROUTE_PREFIX + '/recovery')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('forgot')
  @HttpCode(202)
  async requestPasswordReset(@Body() dto: ForgotPasswordRequestDto): Promise<void> {
    await this.passwordResetService.requestPasswordReset(dto.email);
  }

  @Post('reset')
  @HttpCode(204)
  async passwordReset(@Body() dto: ResetPasswordRequestDto): Promise<void> {
    await this.passwordResetService.resetPasswordByToken(dto);
  }
}
