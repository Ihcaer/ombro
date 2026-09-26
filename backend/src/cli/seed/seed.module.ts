import { Module } from '@nestjs/common';
import { SeedGroupCommand } from './commands/seedGroup.command.js';
import { SeedAdminSubCommand } from './commands/seed-admin.sub-command.js';
import { PrismaModule } from '@core/database/prisma/prisma.module.js';
import { HashModule } from '@shared/hash/hash.module.js';
import { AdminCredentialsQuestions } from './questions/admin-credentials.questions.js';

@Module({
  imports: [PrismaModule, HashModule],
  providers: [SeedGroupCommand, SeedAdminSubCommand, AdminCredentialsQuestions],
})
export class SeedModule {}
