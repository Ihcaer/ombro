import { Module } from '@nestjs/common';
import { HashModule } from './hash/hash.module';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [HashModule, WorkerModule],
  exports: [HashModule, WorkerModule],
})
export class CommonModule {}
