const AUTH_MODULE_PREFIX = 'auth' as const;

export const AUTH_SLUGS = {
  PASSWORD_RESET: AUTH_MODULE_PREFIX + '/' + 'reset-password',
  REGISTRATION: AUTH_MODULE_PREFIX + '/' + 'confirm-registration',
} as const;
