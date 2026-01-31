import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { ConfigModule } from '@nestjs/config';
import serverConfig from '@core/config/envs/server.config';

@Module({
  imports: [ConfigModule.forFeature(serverConfig)],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
