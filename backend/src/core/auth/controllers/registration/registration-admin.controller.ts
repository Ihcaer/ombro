import { AUTH_ROUTE_PREFIX } from '@core/auth/auth.constants.js';
import { AdminController } from '@core/auth/decorators/index.js';
import { REGISTER_ENDPOINT_PREFIX } from './registration-controllers.constants.js';
import { AdminRegistrationService } from '@core/auth/services/admin-registration/admin-registration.service.js';
import { Body, Post, Req } from '@nestjs/common';
import { CreateAdminRequestDto, CreateAdminResponseDto } from '@core/auth/dto/index.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AccessJwtPayload } from '@core/auth/types/jwt.types.js';

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
  async createAdmin(
    @Req() req: Request,
    @Body() dto: CreateAdminRequestDto,
  ): Promise<CreateAdminResponseDto> {
    const admin = req.user as AccessJwtPayload;
    return await this.adminRegistrationService.createAdminAccount(dto, admin.id);
  }
}
