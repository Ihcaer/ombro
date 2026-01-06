import { Module } from '@nestjs/common';
import { UrlManagerService } from './url-manager.service';
import { PrismaModule } from '@core/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UrlManagerService],
  exports: [UrlManagerService],
})
export class UrlManagerModule {}
