import { AUTH_ROUTE_PREFIX } from '@core/auth/auth.constants';
import { ResetPasswordRequestDto } from '@core/auth/dto';
import { PasswordResetService } from '@core/auth/services/password-reset/password-reset.service';
import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { isEmail } from 'class-validator';

@Controller(AUTH_ROUTE_PREFIX + '/password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('forgot')
  @HttpCode(202)
  async requestPasswordReset(@Body() email: string): Promise<void> {
    const isBodyEmail: boolean = isEmail(email);
    if (!isBodyEmail) throw new BadRequestException('Sent value is not valid email.');

    const emailTrimmed = email.trim();

    await this.passwordResetService.requestPasswordReset(emailTrimmed);
  }

  @Post('reset')
  @HttpCode(204)
  async passwordReset(@Body() dto: ResetPasswordRequestDto): Promise<void> {
    await this.passwordResetService.resetPasswordByToken(dto);
  }
}
