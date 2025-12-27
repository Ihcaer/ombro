import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import dbConfig from '@config/db.config';

@Module({
  imports: [ConfigModule.forFeature(dbConfig)],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
