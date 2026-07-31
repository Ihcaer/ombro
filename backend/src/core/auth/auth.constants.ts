export const AUTH_ROUTE_PREFIX = 'auth';
export const PASSWORD_SALT_ROUNDS: number = 12;
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

export const TOKEN_CLEANUP_QUEUE = 'token-cleanup-queue';
export const TOKEN_CLEANUP_JOBS = {
  PURGE_OTT: 'purge-expired-one-time-tokens',
  PURGE_REFRESH: 'purge-expired-refresh-tokens',
} as const;
export type TokenCleanupJobName = (typeof TOKEN_CLEANUP_JOBS)[keyof typeof TOKEN_CLEANUP_JOBS];
