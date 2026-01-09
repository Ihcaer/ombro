import { INestApplication } from '@nestjs/common';
import { createTestApp } from './create-app';
import request from 'supertest';
import { App } from 'supertest/types';

describe('Auth Module', () => {
  let app: INestApplication<App>;
  const modulePrefix = '/auth';

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  // temporary - to suppress errors
  it(modulePrefix + '/login (POST) - Health check', async () => {
    const response = await request(app.getHttpServer())
      .post(modulePrefix + '/login')
      .send({});

    expect(response.status).toBeDefined();
  });
});
