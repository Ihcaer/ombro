import { Prisma } from '@generated/prisma-client/client.js';

export type Module = 'admin' | 'team';
export type Action = 'create' | 'update' | 'delete' | 'other';
export type EntityType = 'admin';
export type Changes<T = Record<string, Prisma.JsonValue>> = {
  before?: Partial<T | null>;
  after?: Partial<T | null>;
  diff?: Partial<Record<keyof T, { from: Prisma.JsonValue; to: Prisma.JsonValue }>>;
};
