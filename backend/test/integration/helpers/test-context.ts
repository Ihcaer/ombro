import { PrismaService } from '@core/database/prisma/prisma.service';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../../src/app.module';
import { clearDatabase } from './clear-database';
import { App } from 'supertest/types';
import { AdminFactory } from './factories';
import { getEmailContent, MailpitDetail, MailpitSummary, waitForEmail } from './email';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import Redis from 'ioredis';
import { execSync } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

export class TestContext {
  app!: INestApplication<App>;
  prisma!: PrismaService;
  adminFactory!: AdminFactory;
  email!: {
    waitForEmail: (
      emailData: { recipient: string; subject: string },
      retries?: number,
      delay?: number,
    ) => Promise<MailpitSummary>;
    getEmailContent: (emailId: string) => Promise<MailpitDetail>;
  };

  private postgresContainer!: StartedPostgreSqlContainer;
  private redisQueueContainer!: StartedRedisContainer;
  private mailpitContainer!: StartedTestContainer;

  private readonly logger = new Logger('Integration tests bootstrap');

  private static readonly EMAIL_CONFIG = { portSMTP: 1025, port: 8025 };

  async init() {
    try {
      const [pg, redis, mailpit] = await Promise.all([
        this.startPostgresql(),
        this.startRedisQueue(),
        this.startMailpit(),
      ]);

      this.postgresContainer = pg;
      this.redisQueueContainer = redis;
      this.mailpitContainer = mailpit;

      this.setupEnvironment();

      execSync('npx prisma migrate deploy', { env: { ...process.env } });

      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      this.app = moduleFixture.createNestApplication();

      this.app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          transform: true,
        }),
      );
      this.app.use(cookieParser());

      this.prisma = moduleFixture.get<PrismaService>(PrismaService);
      this.adminFactory = new AdminFactory(this.prisma);
      this.email = {
        waitForEmail: (
          emailData: { recipient: string; subject: string },
          retries?: number,
          delay?: number,
        ) => waitForEmail(this.getMailpitUrl(), emailData, retries, delay),
        getEmailContent: (emailId: string) => getEmailContent(this.getMailpitUrl(), emailId),
      };

      await this.app.init();
      return this;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.fatal(
        `Critical error while initializing the test application. Reason: ${errorMessage}`,
      );
      await this.close();
      process.exit(1);
    }
  }

  async clearDatabase() {
    if (!this.prisma) {
      this.logger.warn('DB cleanup skipped: Prisma not initialized');
      return;
    }
    await clearDatabase(this.prisma, this.logger);
  }

  async clearRedisQueue() {
    if (!this.redisQueueContainer) return;

    await setTimeout(100);

    const client = new Redis({
      host: this.redisQueueContainer.getHost(),
      port: this.redisQueueContainer.getPort(),
    });

    try {
      await client.flushall();
    } finally {
      await client.quit();
    }
  }

  async close() {
    if (this.app) await this.app.close().catch(() => {});

    await Promise.all([
      this.postgresContainer?.stop(),
      this.redisQueueContainer?.stop(),
      this.mailpitContainer?.stop(),
    ]);
  }

  private setupEnvironment() {
    const emailConfig = TestContext.EMAIL_CONFIG;

    process.env.POSTGRES_URL = this.postgresContainer.getConnectionUri();

    process.env.REDIS_QUEUE_HOST = this.redisQueueContainer.getHost();
    process.env.REDIS_QUEUE_PORT = this.redisQueueContainer.getPort().toString();

    process.env.EMAIL_HOST = this.mailpitContainer.getHost();
    process.env.EMAIL_PORT = this.mailpitContainer.getMappedPort(emailConfig.portSMTP).toString();
  }

  private getMailpitUrl(): string {
    return `http://${this.mailpitContainer.getHost()}:${this.mailpitContainer.getMappedPort(TestContext.EMAIL_CONFIG.port)}/api/v1`;
  }

  private async startPostgresql() {
    return await new PostgreSqlContainer('postgres:18-alpine')
      .withDatabase('testdb')
      .withUsername('testuser')
      .withPassword('testpassword')
      .start();
  }

  private async startRedisQueue() {
    return await new RedisContainer('redis:8-alpine').start();
  }

  private async startMailpit() {
    const { portSMTP, port } = TestContext.EMAIL_CONFIG;
    return await new GenericContainer('axllent/mailpit:v1.28')
      .withExposedPorts(portSMTP, port)
      .withWaitStrategy(Wait.forListeningPorts())
      .start();
  }
}
