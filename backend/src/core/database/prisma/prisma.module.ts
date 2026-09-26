import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '@core/config/envs/database.config.js';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
