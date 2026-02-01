import { PrismaService } from '@core/database/prisma/prisma.service';
import { AuthAdmin } from '@generated/prisma-client';
import { Injectable } from '@nestjs/common';
import { HashService } from '@shared/hash/hash.service';
import { hash } from 'bcrypt';

@Injectable()
export class AdminFactory {
  constructor(private readonly prisma: PrismaService) {}

  async create(overrides: Partial<AuthAdmin> = {}): Promise<AuthAdmin> {
    let defaultPassword: string = 'default-password';
    const defaultPrivileges: number = 1;
    const adminIndex: number = Math.random();
    if (overrides.password) {
      overrides.password = await hash(overrides.password, HashService.DEFAULT_SALT_ROUNDS);
    } else {
      defaultPassword = await hash(defaultPassword, HashService.DEFAULT_SALT_ROUNDS);
    }

    return this.prisma.authAdmin.create({
      data: {
        displayName: 'Test Admin',
        handleName: `handle-${adminIndex}`,
        email: `test-${adminIndex}@mail.com`,
        password: defaultPassword,
        privileges: defaultPrivileges,
        verification: 'VERIFIED',
        isActivated: true,
        ...overrides,
      },
    });
  }
}
