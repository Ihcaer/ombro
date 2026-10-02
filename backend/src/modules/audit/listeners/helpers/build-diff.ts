import { Prisma } from '@generated/prisma-client/client.js';
import { Changes } from '@modules/audit/audit-log-fields.types.js';

type BuildDiffOptions<T extends Record<PropertyKey, unknown>> = Omit<Changes<T>, 'diff'> & {
  sensitiveFields?: (keyof T)[];
};

export const buildChanges = <T extends Record<PropertyKey, unknown>>({
  before = null,
  after = null,
  sensitiveFields = [],
}: BuildDiffOptions<T>): Changes<T> => {
  const sanitizedBefore = sanitizeObject(before, sensitiveFields);
  const sanitizedAfter = sanitizeObject(after, sensitiveFields);

  const diff = {} as Record<keyof T, { from: Prisma.JsonValue; to: Prisma.JsonValue }>;

  const beforeKeys = sanitizedBefore ? (Object.keys(sanitizedBefore) as (keyof T)[]) : [];
  const afterKeys = sanitizedAfter ? (Object.keys(sanitizedAfter) as (keyof T)[]) : [];

  const allKeys = Array.from(new Set([...beforeKeys, ...afterKeys]));

  for (const key of allKeys) {
    const rawFrom = sanitizedBefore ? sanitizedBefore[key] : null;
    const rawTo = sanitizedAfter ? sanitizedAfter[key] : null;

    if (sanitizedBefore && sanitizedAfter && JSON.stringify(rawFrom) === JSON.stringify(rawTo)) {
      continue;
    }

    diff[key] = {
      from: rawFrom ?? null,
      to: rawTo ?? null,
    };
  }

  return {
    before: sanitizedBefore,
    after: sanitizedAfter,
    diff,
  };
};

const sanitizeObject = <T extends Record<PropertyKey, unknown>>(
  obj: Partial<T> | null,
  sensitiveFields: (keyof T)[],
): Partial<T> | null => {
  if (!obj) return null;
  const sanitized = { ...obj };

  for (const key of sensitiveFields) {
    if (key in sanitized) sanitized[key] = '[REDACTED]' as unknown as T[keyof T];
  }
  return sanitized;
};
