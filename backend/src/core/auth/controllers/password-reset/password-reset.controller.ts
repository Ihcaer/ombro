import { AUTH_ROUTE_PREFIX } from '@core/auth/auth.constants';
import { PublicController } from '@core/auth/decorators';
import { ResetPasswordRequestDto } from '@core/auth/dto';
import { ForgotPasswordRequestDto } from '@core/auth/dto/forgot-password-request.dto';
import { PasswordResetService } from '@core/auth/services/password-reset/password-reset.service';
import { Body, HttpCode, Post } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { errorResponseExamples } from '@shared/swagger/error-response-examples.helper';

@ApiTags('AuthPasswordReset')
@PublicController(AUTH_ROUTE_PREFIX, 'recovery')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  /**
   * Requests the password reset.
   */
  @Post('forgot')
  @HttpCode(202)
  @ApiAcceptedResponse({
    description: 'An email with a link has been sent if the account exists in the system',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error.' })
  async requestPasswordReset(@Body() dto: ForgotPasswordRequestDto): Promise<void> {
    await this.passwordResetService.requestPasswordReset(dto.email);
  }

  /**
   * Resets password.
   */
  @Post('reset')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Password reset' })
  @ApiUnprocessableEntityResponse({
    description: 'Password does not meet the requirements.',
    content: errorResponseExamples([
      {
        errorCode: 'WEAK_PASSWORD',
        message: PasswordResetService.DEFAULT_RESET_PASSWORD_INTERNAL_ERR_MESSAGE,
      },
      {
        message: 'The password is too weak or contains data from an email, handle or display name.',
      },
    ]),
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error.' })
  async passwordReset(@Body() dto: ResetPasswordRequestDto): Promise<void> {
    await this.passwordResetService.resetPasswordByToken(dto);
  }
}
