import { MockResponse } from '../mock-registry';
import {
  ConfirmAdminAccountFormFieldResponseDto,
  LoginResponseDto,
} from '@ombro/shared/data-access/api-client';

export const demoAccessToken = 'demo-token';
const loginResponseBody: LoginResponseDto = {
  accessToken: demoAccessToken,
  adminData: {
    id: 1,
    avatarUrl: null,
    displayName: 'Demo User',
    handleName: 'DemoAdmin123',
    privileges: ['ADMINS_MANAGE', 'BLOG_MANAGE', 'FILE_MANAGE', 'OWNER'],
    isActivated: true,
    verification: 'VERIFIED',
    preferences: { language: 'en' },
  },
} as const;

const checkRegistrationEligibilityBody: ConfirmAdminAccountFormFieldResponseDto = {
  fields: ['password'],
} as const;

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
