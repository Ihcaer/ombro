import { Module } from '@nestjs/common';
import { HashService } from './hash.service';
import { ConfigModule } from '@nestjs/config';
import serverConfig from '@config/server.config';
import { WorkerModule } from '@common/worker/worker.module';

@Module({
  imports: [ConfigModule.forFeature(serverConfig), WorkerModule],
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}
