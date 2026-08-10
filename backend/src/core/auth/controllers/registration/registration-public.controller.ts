import { AUTH_ROUTE_PREFIX } from '@core/auth/auth.constants';
import { PublicController } from '@core/auth/decorators';
import {
  FieldsToConfirmAccountRequestDto,
  ConfirmAdminAccountFormFieldResponseDto,
  ConfirmAdminRequestDto,
} from '@core/auth/dto';
import { AdminRegistrationService } from '@core/auth/services/admin-registration/admin-registration.service';
import { Body, Get, HttpCode, Param, Patch } from '@nestjs/common';
import { REGISTER_ENDPOINT_PREFIX } from './registration-controllers.constants';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('AuthRegistration')
@PublicController(AUTH_ROUTE_PREFIX, REGISTER_ENDPOINT_PREFIX)
export class RegistrationPublicController {
  constructor(private readonly adminRegistrationService: AdminRegistrationService) {}

  /**
   * Sends form fields needed to finalize registration.
   */
  @Get('invite/:token')
  @ApiParam({ name: 'token', type: String, description: 'One time token' })
  async getFieldsToConfirmAccount(
    @Param() params: FieldsToConfirmAccountRequestDto,
  ): Promise<ConfirmAdminAccountFormFieldResponseDto> {
    return await this.adminRegistrationService.getFormFieldsToConfirm(params.token);
  }

  /**
   * Confirms admin account.
   */
  @Patch('confirm')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Account confirmed' })
  @ApiBadRequestResponse({ description: 'Password does not meet the requirements.' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error.' })
  async confirmAdmin(@Body() requestDto: ConfirmAdminRequestDto): Promise<void> {
    await this.adminRegistrationService.accountConfirmation(requestDto);
  }
}
