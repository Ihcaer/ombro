import { Module } from '@nestjs/common';
import { UrlManagerService } from './url-manager.service.js';
import { PrismaModule } from '@core/database/prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [UrlManagerService],
  exports: [UrlManagerService],
})
export class UrlManagerModule {}
