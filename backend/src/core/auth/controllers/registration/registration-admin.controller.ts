import { AUTH_ROUTE_PREFIX } from '@core/auth/auth.constants';
import { AdminController } from '@core/auth/decorators';
import { REGISTER_ENDPOINT_PREFIX } from './registration-controllers.constants';
import { AdminRegistrationService } from '@core/auth/services/admin-registration/admin-registration.service';
import { Body, Post } from '@nestjs/common';
import { CreateAdminRequestDto, CreateAdminResponseDto } from '@core/auth/dto';

@AdminController(AUTH_ROUTE_PREFIX, REGISTER_ENDPOINT_PREFIX, ['ADMINS_MANAGE'])
export class RegistrationAdminController {
  constructor(private readonly adminRegistrationService: AdminRegistrationService) {}

  @Post('create-admin')
  async createAdmin(@Body() dto: CreateAdminRequestDto): Promise<CreateAdminResponseDto> {
    return await this.adminRegistrationService.createAdminAccount(dto);
  }
}
