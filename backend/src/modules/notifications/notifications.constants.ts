export const NOTIFICATIONS_QUEUE = 'notifications';

export const EMAIL_JOBS = {
  SEND_PASSWORD_RESET: 'send-admin-password-reset-email',
  SEND_ADMIN_ACTIVATION: 'send-admin-account-activation-email',
} as const;

export type EmailJobName = (typeof EMAIL_JOBS)[keyof typeof EMAIL_JOBS];
