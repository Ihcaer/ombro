import { AuditLogCreateInput } from '@generated/prisma-client/models.js';
import { AuditLogTypedFields } from '../types/audit-log.types.js';

export interface CreateLogDto
  extends Omit<AuditLogCreateInput, keyof AuditLogTypedFields>, AuditLogTypedFields {}
