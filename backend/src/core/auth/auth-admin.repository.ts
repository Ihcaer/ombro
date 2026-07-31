import { Prisma } from '@generated/prisma-client';
import { Injectable } from '@nestjs/common';
import { AdminData, Identifier } from './types/admin.types';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { AdminDto } from './dto/admin.dto';
import { RefreshTokenMetadata, RefreshTokenMetadataTable } from './types/jwt.types';

@Injectable()
export class AuthAdminRepository {
  constructor(private prisma: PrismaService) {}

  async findAdminByIdentifier(
    identifier: string,
    identifierType: Identifier,
  ): Promise<AdminDto | null> {
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
        avatarFileId: true,
        privileges: true,
        verification: true,
        isActivated: true,
      },
    });
  }

  async findAdminAndRefreshTokensById(
    id: AdminData['id'],
  ): Promise<(AdminData & { refreshTokens: RefreshTokenMetadataTable }) | null> {
    const result = await this.prisma.authAdmin.findUnique({
      where: { id },
      select: {
        id: true,
        displayName: true,
        handleName: true,
        avatarFileId: true,
        privileges: true,
        verification: true,
        isActivated: true,
        refreshTokens: {
          select: {
            refreshTokenHash: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!result?.refreshTokens) return null;

    return result;
  }

  async findRefreshTokensByAdminId(
    adminId: AdminData['id'],
  ): Promise<RefreshTokenMetadataTable | null> {
    const result = await this.prisma.authRefreshToken.findMany({
      where: { adminId },
      select: { refreshTokenHash: true, expiresAt: true },
    });
    if (result.length === 0) return null;

    return result;
  }

  async deleteRefreshTokenByHashAndAdminId(
    refreshTokenHash: RefreshTokenMetadata['refreshTokenHash'],
    adminId: AdminData['id'],
  ): Promise<void> {
    await this.prisma.authRefreshToken.delete({
      where: { refreshTokenHash, adminId },
      select: { id: true },
    });
  }

  async saveRefreshToken(adminId: AdminData['id'], hash: string, expiresAt: Date): Promise<void> {
    await this.prisma.authAdmin.update({
      where: { id: adminId },
      data: {
        lastLogged: new Date(),
        refreshTokens: {
          create: { refreshTokenHash: hash, expiresAt },
        },
      },
    });
  }

  async deleteOneTimeTokenById(id: number): Promise<void> {
    await this.prisma.authOneTimeToken.delete({ where: { id }, select: { id: true } });
  }

  async deleteExpiredOneTimeTokens(): Promise<number> {
    const now = new Date();
    const result = await this.prisma.authOneTimeToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    return result.count;
  }

  async deleteExpiredRefreshTokens(): Promise<number> {
    const now = new Date();
    const result = await this.prisma.authRefreshToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    return result.count;
  }
}
