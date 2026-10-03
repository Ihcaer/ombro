import { Prisma } from '@generated/prisma-client/client.js';

export type Module = 'AUTH' | 'TEAM';
export type Action = 'CREATE' | 'UPDATE' | 'DELETE' | 'OTHER';
export type EntityType = 'ADMIN';
export type Changes<T extends object> = Partial<
  Record<keyof T, { from: Prisma.JsonValue; to: Prisma.JsonValue }>
>;
