import { PrismaService } from '@core/database/prisma/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { AppModule } from 'src/app.module';
import { clearDatabase } from './clear-database';
import { App } from 'supertest/types';
import { AdminFactory } from './factories';

export class TestContext {
  app: INestApplication<App>;
  prisma: PrismaService;
  adminFactory: AdminFactory;

  static async init() {
    try {
      const context = new TestContext();
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      context.app = moduleFixture.createNestApplication();

      context.app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          transform: true,
        }),
      );
      context.app.use(cookieParser());

      context.prisma = moduleFixture.get<PrismaService>(PrismaService);
      context.adminFactory = new AdminFactory(context.prisma);

      await context.app.init();
      return context;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Critical error while initializing the test application: ' + errorMessage);

      process.exit(1);
    }
  }

  async cleanup() {
    await clearDatabase(this.prisma);
    await this.app.close();
  }
}
