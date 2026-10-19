import { AdminController } from '@core/auth/decorators/controller.decorators.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TEAM_MODULE_ROUTE_PREFIX } from '../team.constants.js';
import { Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AdminOwnProfileDataResponseDto } from './dto/admin-own-profile-data-response.dto.js';
import { getAdminFromRequest } from '@core/auth/utils/get-admin-from-request.util.js';
import { AdminProfileService } from './admin-profile.service.js';
import { Admin } from '@core/auth/decorators/auth.decorators.js';
import { AdminProfileDataResponseDto } from './dto/admin-profile-data-response.dto.js';
import type { AdminId } from '../team.types.js';
import { AuditLogService } from '@modules/audit/services/audit-log/audit-log.service.js';

@ApiTags('TeamAdminProfile')
@ApiBearerAuth()
@AdminController(TEAM_MODULE_ROUTE_PREFIX, 'profile')
export class AdminProfileController {
  constructor(
    private readonly adminProfileService: AdminProfileService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get('me')
  async getAdminOwnData(@Req() req: Request): Promise<AdminOwnProfileDataResponseDto> {
    const admin = getAdminFromRequest(req);
    const adminId = admin.id;

    const adminProfile = await this.adminProfileService.getSelfProfile(adminId);
    const auditLog = await this.auditLogService.getLogs(
      adminId,
      {
        id: adminId,
        privileges: admin.privileges,
      },
      { recordsNumber: 3 },
    );

    return { adminProfile, auditLog };
  }

  @Get(':id')
  @Admin()
  async getAdminProfileData(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: AdminId,
  ): Promise<AdminProfileDataResponseDto> {
    const requester = getAdminFromRequest(req);

    const adminProfile = await this.adminProfileService.getProfile(id);
    const auditLog = await this.auditLogService.getLogs(
      id,
      {
        id: requester.id,
        privileges: requester.privileges,
      },
      { recordsNumber: 3 },
    );

    return { adminProfile, auditLog };
  }
}
