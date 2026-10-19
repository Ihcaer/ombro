import { Module } from '@nestjs/common';
import { AdminProfileService } from './admin-profile.service.js';
import { PrismaModule } from '@core/database/prisma/prisma.module.js';
import { AdminProfileController } from './admin-profile.controller.js';
import { AuthModule } from '@core/auth/auth.module.js';
import { AuditModule } from '@modules/audit/audit.module.js';

@Module({
  imports: [PrismaModule, AuthModule, AuditModule],
  providers: [AdminProfileService],
  controllers: [AdminProfileController],
})
export class AdminProfileModule {}
