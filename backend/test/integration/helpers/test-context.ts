import { PrismaService } from '@core/database/prisma/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { AppModule } from 'src/app.module';
import { clearDatabase } from './clear-database';
import { App } from 'supertest/types';
import { AdminFactory } from './factories';
import { getEmailContent, MailpitDetail, MailpitSummary, waitForEmail } from './email';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import * as Minio from 'minio';
import { execSync } from 'node:child_process';

export class TestContext {
  app: INestApplication<App>;
  prisma: PrismaService;
  adminFactory: AdminFactory;
  email: {
    waitForEmail: (
      emailData: { recipient: string; subject: string },
      retries?: number,
      delay?: number,
    ) => Promise<MailpitSummary>;
    getEmailContent: (emailId: string) => Promise<MailpitDetail>;
  };

  private postgresContainer: StartedPostgreSqlContainer;
  private minioContainer: StartedTestContainer;
  private mailpitContainer: StartedTestContainer;

  private static readonly MINIO_CONFIG = {
    port: 9000,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
    ssl: false,
    buckets: { admin: 'private', public: 'public' },
  };
  private static readonly EMAIL_CONFIG = { portSMTP: 1025, port: 8025 };

  async init() {
    try {
      const [pg, minio, mailpit] = await Promise.all([
        this.startPostgresql(),
        this.startMinio(),
        this.startMailpit(),
      ]);

      this.postgresContainer = pg;
      this.minioContainer = minio;
      this.mailpitContainer = mailpit;

      this.setupEnvironment();
      await this.initializeMinioBuckets();

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
      console.error('Critical error while initializing the test application: ' + errorMessage);

      await this.close();
      process.exit(1);
    }
  }

  async clearDatabase() {
    if (!this.prisma) {
      console.warn('Cleanup skipped: Prisma not initialized');
      return;
    }
    await clearDatabase(this.prisma);
  }

  async close() {
    if (this.app) await this.app.close().catch(() => {});

    await Promise.all([
      this.postgresContainer?.stop(),
      this.minioContainer?.stop(),
      this.mailpitContainer?.stop(),
    ]);
  }

  private setupEnvironment() {
    const minioConfig = TestContext.MINIO_CONFIG;
    const emailConfig = TestContext.EMAIL_CONFIG;

    process.env.POSTGRES_URL = this.postgresContainer.getConnectionUri();

    process.env.MINIO_HOST = this.minioContainer.getHost();
    process.env.MINIO_PORT = this.minioContainer.getMappedPort(minioConfig.port).toString();
    process.env.MINIO_ACCESS_KEY = minioConfig.accessKey;
    process.env.MINIO_SECRET_KEY = minioConfig.secretKey;

    process.env.MINIO_BUCKET_ADMIN = minioConfig.buckets.admin;
    process.env.MINIO_BUCKET_PUBLIC = minioConfig.buckets.public;

    process.env.EMAIL_HOST = this.mailpitContainer.getHost();
    process.env.EMAIL_PORT = this.mailpitContainer.getMappedPort(emailConfig.portSMTP).toString();
  }

  private async initializeMinioBuckets() {
    const minioConfig = TestContext.MINIO_CONFIG;
    const minioClient = new Minio.Client({
      endPoint: this.minioContainer.getHost(),
      port: this.minioContainer.getMappedPort(minioConfig.port),
      useSSL: minioConfig.ssl,
      accessKey: minioConfig.accessKey,
      secretKey: minioConfig.secretKey,
    });
    const buckets: string[] = Object.values(minioConfig.buckets);

    for (const bucket of buckets) {
      const exists = await minioClient.bucketExists(bucket);
      if (!exists) await minioClient.makeBucket(bucket, 'eu-central-1');
    }
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

  private async startMinio() {
    const { port, accessKey, secretKey } = TestContext.MINIO_CONFIG;

    return await new GenericContainer('minio/minio:RELEASE.2025-09-07T16-13-09Z')
      .withExposedPorts(port)
      .withEnvironment({
        MINIO_ACCESS_KEY: accessKey,
        MINIO_SECRET_KEY: secretKey,
      })
      .withCommand(['server', '/data'])
      .withWaitStrategy(Wait.forHttp('/minio/health/live', port))
      .start();
  }

  private async startMailpit() {
    const { portSMTP, port } = TestContext.EMAIL_CONFIG;
    return await new GenericContainer('axllent/mailpit:v1.28')
      .withExposedPorts(portSMTP, port)
      .withWaitStrategy(Wait.forListeningPorts())
      .start();
  }
}
