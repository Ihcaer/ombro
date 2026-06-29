import { LoginResponseDto } from '@ombro/admin-panel/app/core/auth/dto/login.dtos';
import { MockResponse } from '../mock-registry';
import { RegistrationEligibilityResponseDto } from '../../core/auth/dto/admin-register.dtos';

const loginResponseBody: LoginResponseDto = {
  accessToken: 'demo-access-token',
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
};

const checkRegistrationEligibilityBody: RegistrationEligibilityResponseDto = ['password'];

export const mockLoginResponse: MockResponse = { status: 201, body: loginResponseBody };
export const mockRefreshTokenResponse: MockResponse = { status: 200, body: loginResponseBody };
export const mockLogoutResponse: MockResponse = { status: 204, body: undefined };

export const mockRequestPasswordReset: MockResponse = { status: 202, body: undefined };
export const mockResetPassword: MockResponse = { status: 204, body: undefined };

export const mockCheckRegistrationEligibility: MockResponse = {
  status: 200,
  body: checkRegistrationEligibilityBody,
};
export const mockFinalizeAdminRegistration: MockResponse = { status: 204, body: undefined };
