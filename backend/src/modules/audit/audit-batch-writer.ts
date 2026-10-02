import { PrismaService } from '@core/database/prisma/prisma.service.js';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto.js';

type PendingRecord = {
  record: CreateLogDto;
  resolve: () => void;
  reject: (error: unknown) => void;
};

@Injectable()
export class AuditBatchWriter implements OnModuleInit, OnModuleDestroy {
  private static readonly BATCH_SIZE = 500;
  private static readonly FLUSH_INTERVAL = 100;

  private readonly logger = new Logger(AuditBatchWriter.name);

  private buffer: PendingRecord[] = [];

  private flushTimer?: NodeJS.Timeout;
  private flushing = false;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit(): void {
    this.flushTimer = setInterval(() => void this.flush(), AuditBatchWriter.FLUSH_INTERVAL);
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

  add(record: CreateLogDto): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.buffer.push({
        record,
        resolve,
        reject,
      });

      if (this.buffer.length >= AuditBatchWriter.BATCH_SIZE) {
        void this.flush();
      }
    });
  }

  private async flush(): Promise<void> {
    if (this.flushing || this.buffer.length === 0) return;

    this.flushing = true;

    const batch = this.buffer.splice(0, AuditBatchWriter.BATCH_SIZE);
    try {
      await this.prisma.auditLog.createMany({
        data: batch.map(({ record }) => record),
      });

      for (const item of batch) {
        item.resolve();
      }
    } catch (error) {
      this.logger.error(
        `Failed to persist audit batch (${batch.length} records)`,
        error instanceof Error ? error.stack : String(error),
      );

      for (const item of batch) {
        item.reject(error);
      }
    } finally {
      this.flushing = false;
      if (this.buffer.length >= AuditBatchWriter.BATCH_SIZE) void this.flush();
    }
  }
}
