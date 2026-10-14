import { AUTH_ROUTE_PREFIX } from '@core/auth/auth.constants.js';
import { AdminController } from '@core/auth/decorators/controller.decorators.js';
import { ChangePasswordRequestDto } from '@core/auth/dto/requests/change-password-request.dto.js';
import { AdminCredentialsService } from '@core/auth/services/admin-credentials/admin-credentials.service.js';
import { getAdminFromRequest } from '@core/auth/utils/get-admin-from-request.util.js';
import { Body, HttpCode, Patch, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

@ApiTags('Auth')
@ApiBearerAuth()
@AdminController(AUTH_ROUTE_PREFIX)
export class AuthAdminController {
  constructor(private readonly adminCredentialsService: AdminCredentialsService) {}

  @Patch('change-password')
  @HttpCode(204)
  async changePassword(@Req() req: Request, @Body() dto: ChangePasswordRequestDto): Promise<void> {
    const admin = getAdminFromRequest(req);
    await this.adminCredentialsService.changePassword(dto, admin.id, admin.sessionId);
  }
}
