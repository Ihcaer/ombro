import { AuditLogCreateInput } from '@generated/prisma-client/models.js';
import { Action, Changes, EntityType, Module } from '../audit-log-fields.types.js';
import { MapSelected } from '@shared/types/type-edit.types.js';

type AuditLogTypedFields = MapSelected<
  AuditLogCreateInput,
  {
    module: Module;
    action: Action;
    entityType: EntityType;
    changes?: Changes<Record<string, unknown>>;
    metadata?: object;
  }
>;

export interface CreateLogDto
  extends Omit<AuditLogCreateInput, keyof AuditLogTypedFields>, AuditLogTypedFields {}
