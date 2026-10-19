import { PrismaModule } from '@core/database/prisma/prisma.module.js';
import { Module, Provider } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AUDIT_QUEUE_NAME } from './audit-queue.constants.js';
import { LogOnAdminCreatedListener } from './listeners/team/log-on-admin-created.listener.js';
import { AuditLogService } from './services/audit-log/audit-log.service.js';
import { AuditService } from './services/audit/audit.service.js';
import { AuditBatchWriterService } from './services/audit-batch-writer/audit-batch-writer.service.js';

const LISTENERS: Provider[] = [LogOnAdminCreatedListener];

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: AUDIT_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: { age: 3600, count: 1000 },
        removeOnFail: { age: 86400 * 7, count: 5000 },
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    }),
  ],
  providers: [AuditService, AuditBatchWriterService, AuditLogService, ...LISTENERS],
  exports: [AuditLogService],
})
export class AuditModule {}
