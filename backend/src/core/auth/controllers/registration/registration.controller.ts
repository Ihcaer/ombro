import { AUTH_ROUTE_PREFIX } from '@core/auth/auth.constants';
import { Auth } from '@core/auth/decorators';
import {
  CreateAdminRequestDto,
  CreateAdminResponseDto,
  FieldsToConfirmAccountRequestDto,
  ConfirmAdminAccountFormFieldDto,
  ConfirmAdminRequestDto,
} from '@core/auth/dto';
import { AdminPrivileges } from '@core/auth/enums/admin-privileges';
import { AdminRegistrationService } from '@core/auth/services/admin-registration/admin-registration.service';
import { Body, Controller, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';

@Controller(AUTH_ROUTE_PREFIX + '/register')
export class RegistrationController {
  constructor(private readonly adminRegistrationService: AdminRegistrationService) {}

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
