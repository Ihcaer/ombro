import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { AppModule } from 'src/app.module';
import { App } from 'supertest/types';

export async function createTestApp(): Promise<INestApplication<App>> {
  try {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.use(cookieParser());

    await app.init();
    return app;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(
      'Critical error while initializing the test application: ' + errorMessage,
    );

    process.exit(1);
  }
}
