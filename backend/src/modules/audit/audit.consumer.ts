import { Processor, WorkerHost } from '@nestjs/bullmq';
import { AUDIT_QUEUE_NAME, AuditJob } from './audit-queue.constants.js';
import { Job } from 'bullmq';
import { CreateLogDto } from './dto/create-log.dto.js';
import { AuditBatchWriter } from './audit-batch-writer.js';

@Processor(AUDIT_QUEUE_NAME)
export class AuditConsumer extends WorkerHost {
  constructor(private readonly auditBatchWriter: AuditBatchWriter) {
    super();
  }

  async process(job: Job<AuditJob>): Promise<any> {
    const record = this.processJob(job);
    await this.auditBatchWriter.add(record);
  }

  private processJob(job: Job<AuditJob>): CreateLogDto {
    return job.data.log;
  }
}
