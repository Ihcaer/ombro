import { Module } from '@nestjs/common';
import { SeedGroupCommand } from './commands/seedGroup.command';
import { SeedAdminSubCommand } from './commands/seed-admin.sub-command';
import { PrismaModule } from '@core/database/prisma/prisma.module';
import { HashModule } from '@shared/hash/hash.module';
import { AdminCredentialsQuestions } from './questions/admin-credentials.questions';

@Module({
  imports: [PrismaModule, HashModule],
  providers: [SeedGroupCommand, SeedAdminSubCommand, AdminCredentialsQuestions],
})
export class SeedModule {}
