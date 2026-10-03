import { CreateLogDto } from './dto/create-log.dto.js';

export type AuditJob = { name: string; log: CreateLogDto };

export const AUDIT_QUEUE_NAME = 'audit-queue';

const LOG_JOB_PREFIX = 'log:';
export enum LogJobsAuthModule {
  ADMIN_CREATED = LOG_JOB_PREFIX + 'admin-created',
  ADMIN_ACCOUNT_CONFIRMED = LOG_JOB_PREFIX + 'admin-account-confirmed',
  PASSWORD_RECOVERY_COMPLETED = LOG_JOB_PREFIX + 'password-recovery-completed',
}
