import { PasswordStrengthScore } from '@ombro/shared/utils/password-strength';

const PASSWORD_RESET_ENDPOINT_PREFIX = '/recovery' as const;
const ADMIN_REGISTRATION_PREFIX = '/register' as const;

export const AUTH_ROUTE_PREFIX = '/auth' as const;
export const AUTH_ENDPOINTS = {
  LOGIN: '/login',
  REFRESH_TOKEN: '/refresh',
  PASSWORD_RESET: {
    REQUEST_RESET: PASSWORD_RESET_ENDPOINT_PREFIX + '/forgot',
    RESET: PASSWORD_RESET_ENDPOINT_PREFIX + '/reset',
  },
  REGISTRATION: {
    CHECK_ELIGIBILITY: ADMIN_REGISTRATION_PREFIX + '/invite',
    FINALIZE: ADMIN_REGISTRATION_PREFIX + '/confirm',
  },
} as const;

export const MIN_PASSWORD_STRENGTH: PasswordStrengthScore = 3 as const;
