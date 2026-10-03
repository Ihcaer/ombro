import { PrismaModule } from '@core/database/prisma/prisma.module.js';
import { Module, Provider } from '@nestjs/common';
import { AuditService } from './audit.service.js';
import { BullModule } from '@nestjs/bullmq';
import { AUDIT_QUEUE_NAME } from './audit-queue.constants.js';
import { LogOnAdminCreatedListener } from './listeners/team/log-on-admin-created.listener.js';

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
  providers: [AuditService, ...LISTENERS],
})
export class AuditModule {}
