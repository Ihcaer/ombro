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
    await this.tokenCleanupQueue.add(
      TOKEN_CLEANUP_JOBS.PURGE_OTT,
      {},
      {
        jobId: 'purge-ott-job-repeat',
        repeat: { pattern: '0 2 * * *' },
        removeOnComplete: true,
        removeOnFail: 100,
      },
    );
  }

  private async scheduleRefreshTokenCleanup(): Promise<void> {
    await this.tokenCleanupQueue.add(
      TOKEN_CLEANUP_JOBS.PURGE_OTT,
      {},
      {
        jobId: 'purge-refresh-token-job-repeat',
        repeat: { pattern: '0 2 * * *' },
        removeOnComplete: true,
        removeOnFail: 100,
      },
    );
  }
}
