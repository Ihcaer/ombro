import { AUTH_ROUTE_PREFIX } from '@core/auth/auth.constants';
import { AdminController } from '@core/auth/decorators';
import { REGISTER_ENDPOINT_PREFIX } from './registration-controllers.constants';
import { AdminRegistrationService } from '@core/auth/services/admin-registration/admin-registration.service';
import { Body, Post } from '@nestjs/common';
import { CreateAdminRequestDto, CreateAdminResponseDto } from '@core/auth/dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('AuthRegistration')
@ApiBearerAuth()
@AdminController(AUTH_ROUTE_PREFIX, REGISTER_ENDPOINT_PREFIX, ['ADMINS_MANAGE'])
export class RegistrationAdminController {
  constructor(private readonly adminRegistrationService: AdminRegistrationService) {}

  /**
   * Creates admin account.
   */
  @Post('create-admin')
  @ApiCreatedResponse({ description: 'Created admin account', type: CreateAdminResponseDto })
  @ApiBadRequestResponse({ description: 'Email in use.' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error.' })
  async createAdmin(@Body() dto: CreateAdminRequestDto): Promise<CreateAdminResponseDto> {
    return await this.adminRegistrationService.createAdminAccount(dto);
  }
}
