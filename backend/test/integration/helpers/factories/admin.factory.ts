import { Language } from '@core/auth/auth.constants.js';
import { AdminPreferences } from '@core/auth/dto/models/adminPreferences.dto.js';
import { PrismaService } from '@core/database/prisma/prisma.service.js';
import { AuthAdmin, Prisma } from '@generated/prisma-client/client.js';
import { Injectable } from '@nestjs/common';
import { HashService } from '@shared/hash/hash.service.js';
import { hash } from 'bcrypt';

export type AuthAdminFactoryOverrides = Omit<Partial<AuthAdmin>, 'preferences'> & {
  preferences?: AdminPreferences;
};

@Injectable()
export class AdminFactory {
  constructor(private readonly prisma: PrismaService) {}

  async create(overrides: AuthAdminFactoryOverrides = {}): Promise<AuthAdmin> {
    const {
      password: overridePassword,
      preferences: overridePreferences,
      ...restOverrides
    } = overrides;

    const adminIndex = crypto.randomUUID();

    const defaultPrivileges: number = 1;
    const defaultPreferences: AdminPreferences = { language: Language.EN };

    const password = await hash(
      overridePassword ?? 'default-password',
      HashService.DEFAULT_SALT_ROUNDS,
    );
    const preferences = (overridePreferences ??
      defaultPreferences) as unknown as Prisma.AuthAdminCreateInput['preferences'];

    return this.prisma.authAdmin.create({
      data: {
        displayName: 'Test Admin',
        handleName: `handle-${adminIndex}`,
        email: `test-${adminIndex}@mail.com`,
        password,
        privileges: defaultPrivileges,
        verification: 'VERIFIED',
        isActivated: true,
        preferences,
        ...restOverrides,
      },
    });
  }
}
