import { Module } from '@nestjs/common';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [WorkerModule],
  exports: [WorkerModule],
})
export class CommonModule {}
