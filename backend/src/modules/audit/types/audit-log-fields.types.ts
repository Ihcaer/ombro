import { Prisma } from '@generated/prisma-client/client.js';

export type Changes<T extends object> = Partial<
  Record<keyof T, { from: Prisma.JsonValue; to: Prisma.JsonValue }>
>;
