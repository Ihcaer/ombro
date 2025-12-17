import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { HashService } from './tasks/hash/hash.service';

@Module({
  providers: [WorkerService, HashService],
  exports: [HashService],
})
export class WorkerModule {}
