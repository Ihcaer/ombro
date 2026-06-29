import { HttpRequest, HttpResponse } from '@angular/common/http';
import { AUTH_ENDPOINTS, AUTH_ROUTE_PREFIX } from '../core/auth/auth-api-endpoints';
import {
  mockCheckRegistrationEligibility,
  mockFinalizeAdminRegistration,
  mockLoginResponse,
  mockLogoutResponse,
  mockRefreshTokenResponse,
  mockRequestPasswordReset,
  mockResetPassword,
} from './response-mocks/auth-responses.mock';

type RestMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';
type MockHandler = (req: HttpRequest<unknown>) => HttpResponse<unknown>;

type Mock = {
  config: { method: RestMethod; path: string };
  handler: MockHandler;
  delayMs: number;
  matchType: 'exact' | 'contains';
};
export type MockResponse = Pick<HttpResponse<unknown>, 'status' | 'body'>;

export const MOCK_REGISTRY: Mock[] = [
  {
    config: { method: 'POST', path: `${AUTH_ROUTE_PREFIX}/${AUTH_ENDPOINTS.LOGIN}` },
    handler: () => new HttpResponse(mockLoginResponse),
    delayMs: 700,
    matchType: 'exact',
  },
  {
    config: { method: 'POST', path: `${AUTH_ROUTE_PREFIX}/${AUTH_ENDPOINTS.REFRESH_TOKEN}` },
    handler: () => new HttpResponse(mockRefreshTokenResponse),
    delayMs: 700,
    matchType: 'exact',
  },
  {
    config: { method: 'POST', path: `${AUTH_ROUTE_PREFIX}/${AUTH_ENDPOINTS.LOGOUT}` },
    handler: () => new HttpResponse(mockLogoutResponse),
    delayMs: 300,
    matchType: 'exact',
  },
  {
    config: {
      method: 'POST',
      path: `${AUTH_ROUTE_PREFIX}/${AUTH_ENDPOINTS.PASSWORD_RESET.REQUEST_RESET}`,
    },
    handler: () => new HttpResponse(mockRequestPasswordReset),
    delayMs: 500,
    matchType: 'exact',
  },
  {
    config: { method: 'POST', path: `${AUTH_ROUTE_PREFIX}/${AUTH_ENDPOINTS.PASSWORD_RESET.RESET}` },
    handler: () => new HttpResponse(mockResetPassword),
    delayMs: 400,
    matchType: 'contains',
  },
  {
    config: {
      method: 'GET',
      path: `${AUTH_ROUTE_PREFIX}/${AUTH_ENDPOINTS.REGISTRATION.CHECK_ELIGIBILITY}`,
    },
    handler: () => new HttpResponse(mockCheckRegistrationEligibility),
    delayMs: 300,
    matchType: 'exact',
  },
  {
    config: {
      method: 'POST',
      path: `${AUTH_ROUTE_PREFIX}/${AUTH_ENDPOINTS.REGISTRATION.FINALIZE}`,
    },
    handler: () => new HttpResponse(mockFinalizeAdminRegistration),
    delayMs: 300,
    matchType: 'exact',
  },
];
