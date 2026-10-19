import { AdminDataService } from '@core/auth/services/admin-data/admin-data.service.js';
import { Injectable } from '@nestjs/common';
import { AdminId } from '../team.types.js';
import { AdminProfileData, AdminSelfProfileData } from '@core/auth/types/admin.types.js';

@Injectable()
export class AdminProfileService {
  constructor(private readonly adminDataService: AdminDataService) {}

  async getSelfProfile(adminId: AdminId): Promise<AdminSelfProfileData> {
    return this.adminDataService.getSelfAdmin(adminId);
  }

  async getProfile(targetId: AdminId): Promise<AdminProfileData> {
    return this.adminDataService.getAdminData(targetId);
  }
}
