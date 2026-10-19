import { LoginRequestDto } from '@core/auth/dto/index.js';
import { App } from 'supertest/types.js';
import request, { Response } from 'supertest';
import { AUTH_ROUTE_PREFIX } from '@core/auth/auth.constants.js';

const loginEndpoint = `/public/${AUTH_ROUTE_PREFIX}/login`;

export const loginAsAdmin = async (app: App, credentials: LoginRequestDto): Promise<Response> =>
  await request(app).post(loginEndpoint).send(credentials).expect(201);
