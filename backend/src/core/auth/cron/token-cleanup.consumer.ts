import { Processor, WorkerHost } from '@nestjs/bullmq';
import { TOKEN_CLEANUP_QUEUE, TokenCleanupJobName } from '../auth.constants';
import { AuthTokenService } from '../services/auth-token/auth-token.service';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor(TOKEN_CLEANUP_QUEUE)
export class TokenCleanupConsumer extends WorkerHost {
  private readonly logger = new Logger(TokenCleanupConsumer.name);

  constructor(private readonly tokenService: AuthTokenService) {
    super();
  }

  async process(job: Job<any, any, TokenCleanupJobName>): Promise<any> {
    switch (job.name) {
      case 'purge-expired-one-time-tokens': {
        const count = await this.tokenService.deleteExpiredOneTimeTokens();
        this.logger.log(`[OTT] Cleaned up ${count} expired tokens.`);
        break;
      }
      case 'purge-expired-refresh-tokens': {
        const count = await this.tokenService.deleteExpiredRefreshTokens();
        this.logger.log(`[Refresh tokens] Cleaned up ${count} expired tokens.`);
      }
    }
  }
}
