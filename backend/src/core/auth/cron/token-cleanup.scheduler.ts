import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { TOKEN_CLEANUP_JOBS, TOKEN_CLEANUP_QUEUE } from '../auth.constants';
import { Queue } from 'bullmq';

@Injectable()
export class TokenCleanupScheduler implements OnModuleInit {
  constructor(@InjectQueue(TOKEN_CLEANUP_QUEUE) private readonly tokenCleanupQueue: Queue) {}

  async onModuleInit() {
    await this.scheduleOneTimeTokenCleanup();
    await this.scheduleRefreshTokenCleanup();
  }

  private async scheduleOneTimeTokenCleanup(): Promise<void> {
    await this.tokenCleanupQueue.upsertJobScheduler(
      'one-time-token-cleanup-scheduler',
      {
        pattern: '0 2 * * *',
      },
      { name: TOKEN_CLEANUP_JOBS.PURGE_OTT, opts: { removeOnComplete: true, removeOnFail: 100 } },
    );
  }

  private async scheduleRefreshTokenCleanup(): Promise<void> {
    await this.tokenCleanupQueue.upsertJobScheduler(
      'refresh-token-cleanup-scheduler',
      {
        pattern: '0 2 * * *',
      },
      {
        name: TOKEN_CLEANUP_JOBS.PURGE_REFRESH,
        opts: { removeOnComplete: true, removeOnFail: 100 },
      },
    );
  }
}
