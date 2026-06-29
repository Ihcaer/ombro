import { LoginResponseDto } from '@ombro/admin-panel/app/core/auth/dto/login.dtos';
import { MockResponse } from '../mock-registry';
import { RegistrationEligibilityResponseDto } from '../../core/auth/dto/admin-register.dtos';

export const demoAccessToken = 'demo-token';
const loginResponseBody: LoginResponseDto = {
  accessToken: demoAccessToken,
  adminData: {
    id: 1,
    avatarUrl: null,
    displayName: 'Demo User',
    handleName: 'DemoAdmin123',
    email: 'demo-admin@example.com',
    privileges: ['ADMINS_MANAGE', 'BLOG_MANAGE', 'FILE_MANAGE', 'OWNER'],
    isActivated: true,
    verification: 'VERIFIED',
  },
} as const;

const checkRegistrationEligibilityBody: RegistrationEligibilityResponseDto = ['password'] as const;

export const mockLoginResponse: MockResponse = { status: 201, body: loginResponseBody } as const;
export const mockRefreshTokenResponse: MockResponse = {
  status: 200,
  body: loginResponseBody,
} as const;
export const mockLogoutResponse: MockResponse = { status: 204, body: undefined } as const;

export const mockRequestPasswordReset: MockResponse = { status: 202, body: undefined } as const;
export const mockResetPassword: MockResponse = { status: 204, body: undefined } as const;

export const mockCheckRegistrationEligibility: MockResponse = {
  status: 200,
  body: checkRegistrationEligibilityBody,
} as const;
export const mockFinalizeAdminRegistration: MockResponse = {
  status: 204,
  body: undefined,
} as const;
