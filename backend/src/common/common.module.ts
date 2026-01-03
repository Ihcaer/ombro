import { Module } from '@nestjs/common';
import { WorkerModule } from './worker/worker.module';
import { HashModule } from './hash/hash.module';

@Module({
  imports: [WorkerModule, HashModule],
  exports: [HashModule],
})
export class CommonModule {}
