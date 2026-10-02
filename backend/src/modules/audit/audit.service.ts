import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AUDIT_QUEUE_NAME, AuditJob } from './audit-queue.constants.js';

@Injectable()
export class AuditService implements OnModuleInit, OnModuleDestroy {
  private static readonly BATCH_SIZE = 100;
  private static readonly FLUSH_INTERVAL_MS = 100;

  private readonly logger = new Logger(AuditService.name);
  private readonly buffer: AuditJob[] = [];

  private flushTimer?: NodeJS.Timeout;
  private flushing = false;

  constructor(@InjectQueue(AUDIT_QUEUE_NAME) private readonly auditQueue: Queue) {}

  onModuleInit() {
    this.flushTimer = setInterval(() => void this.flush(), AuditService.FLUSH_INTERVAL_MS);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }

    while (this.buffer.length > 0 || this.flushing) {
      if (!this.flushing && this.buffer.length > 0) {
        await this.flush();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }
  }

  log(event: AuditJob): void {
    this.buffer.push(event);
    if (this.buffer.length >= AuditService.BATCH_SIZE) void this.flush();
  }

  private async flush(): Promise<void> {
    if (this.flushing || this.buffer.length === 0) return;

    this.flushing = true;

    const events = this.buffer.splice(0, AuditService.BATCH_SIZE);
    try {
      await this.auditQueue.addBulk(
        events.map((event) => ({
          name: event.name,
          data: event,
        })),
      );
    } catch (error) {
      this.buffer.unshift(...events);
      this.logger.error(
        `Failed to enqueue audit batch (${events.length} events)`,
        error instanceof Error ? error.stack : String(error),
      );
    } finally {
      this.flushing = false;
      if (this.buffer.length >= AuditService.BATCH_SIZE) void this.flush();
    }
  }
}
