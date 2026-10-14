import { AdminProfileData, AdminSelfProfileData } from '@core/auth/types/admin.types.js';
import { PrivilegesUtils } from '@core/auth/utils/privileges.utils.js';
import { PrismaService } from '@core/database/prisma/prisma.service.js';
import { AuthAdmin } from '@generated/prisma-client/client.js';
import { PrismaClientKnownRequestError } from '@generated/prisma-client/internal/prismaNamespace.js';
import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminDataService {
  private readonly logger = new Logger(AdminDataService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getSelfAdmin(id: AuthAdmin['id']): Promise<AdminSelfProfileData> {
    const adminData = await this.prisma.authAdmin
      .findUniqueOrThrow({
        where: { id },
        select: { email: true, lastLogged: true },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          switch (error.code) {
            case '2002':
              this.logger.warn(
                'Get admin data profile data attempted for non-existent admin (user) ID: ' + id,
              );
              throw new UnauthorizedException();
          }
        }
      });

    return adminData!;
  }

  async getAdminData(id: AuthAdmin['id']): Promise<AdminProfileData> {
    const adminData = await this.prisma.authAdmin
      .findUniqueOrThrow({
        where: { id },
        select: {
          displayName: true,
          handleName: true,
          avatarFileId: true,
          email: true,
          lastLogged: true,
          verification: true,
          isActivated: true,
          privileges: true,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          switch (error.code) {
            case '2002':
              this.logger.warn(
                'Get admin data profile data attempted for non-existent admin (user) ID: ' + id,
              );
              throw new NotFoundException();
          }
        }
      });

    const { avatarFileId: _, privileges: privilegesBits, ...adminProfile } = adminData!;

    const avatarUrl: AdminProfileData['avatarUrl'] = null; // Temporary until file support is added
    const privileges = PrivilegesUtils.bitmaskToArray(privilegesBits);

    return { ...adminProfile, avatarUrl, privileges };
  }
}
