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

@PublicController(AUTH_ROUTE_PREFIX, REGISTER_ENDPOINT_PREFIX)
export class RegistrationPublicController {
  constructor(private readonly adminRegistrationService: AdminRegistrationService) {}

  @Get('invite/:token')
  async getFieldsToConfirmAccount(
    @Param() params: FieldsToConfirmAccountRequestDto,
  ): Promise<ConfirmAdminAccountFormFieldDto> {
    return await this.adminRegistrationService.getFormFieldsToConfirm(params.token);
  }

  @Patch('confirm')
  @HttpCode(204)
  async confirmAdmin(@Body() requestDto: ConfirmAdminRequestDto): Promise<void> {
    await this.adminRegistrationService.accountConfirmation(requestDto);
  }
}
