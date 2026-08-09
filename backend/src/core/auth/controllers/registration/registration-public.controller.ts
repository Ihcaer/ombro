import { AUTH_ROUTE_PREFIX } from '@core/auth/auth.constants';
import { PublicController } from '@core/auth/decorators';
import {
  FieldsToConfirmAccountRequestDto,
  ConfirmAdminAccountFormFieldDto,
  ConfirmAdminRequestDto,
} from '@core/auth/dto';
import { AdminRegistrationService } from '@core/auth/services/admin-registration/admin-registration.service';
import { Body, Get, HttpCode, Param, Patch } from '@nestjs/common';
import { REGISTER_ENDPOINT_PREFIX } from './registration-controllers.constants';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
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
  @ApiOkResponse({
    description: 'Sent form fields',
    schema: {
      type: 'array',
      items: { type: 'string', enum: AdminRegistrationService.POSSIBLE_COLUMNS_TO_FILL_OUT },
    },
  })
  @ApiUnprocessableEntityResponse({ description: 'Account is not waiting for verification.' })
  async getFieldsToConfirmAccount(
    @Param() params: FieldsToConfirmAccountRequestDto,
  ): Promise<ConfirmAdminAccountFormFieldDto> {
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
