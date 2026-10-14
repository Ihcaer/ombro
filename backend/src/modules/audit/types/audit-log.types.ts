import { MapSelected, Overwrite } from '@shared/types/type-edit.types.js';
import { Changes } from './audit-log-fields.types.js';
import { Module, Action, EntityType } from '../audit-log-fields.enums.js';
import { AuditLog } from '@generated/prisma-client/client.js';

export type AuditLogTypedFields = MapSelected<
  AuditLog,
  {
    module: Module;
    action: Action;
    entityType: EntityType;
    changes?: Changes<Record<string, unknown>>;
    metadata?: object;
  }
>;

export type AuditLogRecord = Overwrite<AuditLog, AuditLogTypedFields>;
