import { Module } from '@nestjs/common';
import { HashService } from './hash.service';
import { ConfigModule } from '@nestjs/config';
import securityConfig from '@core/config/security.config';
import { WorkerModule } from '@shared/worker/worker.module';

@Module({
  imports: [ConfigModule.forFeature(securityConfig), WorkerModule],
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}
