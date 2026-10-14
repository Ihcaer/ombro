import { AdminDataService } from '@core/auth/services/admin-data/admin-data.service.js';
import { Injectable } from '@nestjs/common';
import { AdminId } from '../team.types.js';
import { AdminProfileData, AdminSelfProfileData } from '@core/auth/types/admin.types.js';

@Injectable()
export class AdminProfileService {
  // private readonly logger = new Logger(AdminProfileService.name);

  constructor(private readonly adminDataService: AdminDataService) {}

  /* async getProfile(
    targetId: AdminId,
    viewerId: AdminId,
  ): Promise<AdminProfileData | AdminSelfProfileData> {
    if (targetId === viewerId) {
      return this.adminDataService.getSelfAdmin(targetId);
    } else {
      return this.adminDataService.getAdminData(targetId);
    }
  } */

  async getSelfProfile(adminId: AdminId): Promise<AdminSelfProfileData> {
    return this.adminDataService.getSelfAdmin(adminId);
  }

  async getProfile(targetId: AdminId): Promise<AdminProfileData> {
    return this.adminDataService.getAdminData(targetId);
  }
}
