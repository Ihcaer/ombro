import { Prisma } from '@generated/prisma-client';
import { Injectable } from '@nestjs/common';
import { AdminData, Identifier } from './types/common.types';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { AdminDto } from './dto/admin.dto';

@Injectable()
export class AuthAdminRepository {
  constructor(private prisma: PrismaService) {}

  async findByIdentifier(identifier: string, identifierType: Identifier): Promise<AdminDto | null> {
    const whereClause = {
      [identifierType]: identifier,
    } as unknown as Prisma.AuthAdminWhereUniqueInput;

    return this.prisma.authAdmin.findUnique({
      where: whereClause,
      select: {
        id: true,
        displayName: true,
        handleName: true,
        password: true,
        avatarId: true,
        privileges: true,
        verification: true,
        isActivated: true,
      },
    });
  }

  async findAdminAndRefreshTokenById(
    id: number,
  ): Promise<{ admin: AdminData; refreshTokenHash: string } | null> {
    const result = await this.prisma.authAdmin.findUnique({
      where: { id },
      select: {
        id: true,
        displayName: true,
        handleName: true,
        avatarId: true,
        privileges: true,
        verification: true,
        isActivated: true,
        refreshToken: {
          select: {
            refreshTokenHash: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!result?.refreshToken) return null;

    const {
      refreshToken: { refreshTokenHash },
      ...adminData
    } = result;

    return { admin: adminData, refreshTokenHash };
  }

  async saveRefreshToken(adminId: number, hash: string, expiresAt: Date): Promise<void> {
    await this.prisma.authAdmin.update({
      where: { id: adminId },
      data: {
        lastLogged: new Date(),
        refreshToken: {
          upsert: {
            create: { refreshTokenHash: hash, expiresAt },
            update: { refreshTokenHash: hash, expiresAt },
          },
        },
      },
    });
  }
}
