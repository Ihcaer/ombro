import { Prisma } from '@generated/prisma-client/client.js';

export type Module = 'ADMIN' | 'TEAM';
export type Action = 'CREATE' | 'UPDATE' | 'DELETE' | 'OTHER';
export type EntityType = 'ADMIN';
export type Changes<T = Record<string, Prisma.JsonValue>> = {
  before?: Partial<T | null>;
  after?: Partial<T | null>;
  diff?: Partial<Record<keyof T, { from: Prisma.JsonValue; to: Prisma.JsonValue }>>;
};
