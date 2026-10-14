import { Module } from '@nestjs/common';
import { AdminProfileService } from './admin-profile.service.js';
import { PrismaModule } from '@core/database/prisma/prisma.module.js';
import { AdminProfileController } from './admin-profile.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [AdminProfileService],
  controllers: [AdminProfileController],
})
export class AdminProfileModule {}
