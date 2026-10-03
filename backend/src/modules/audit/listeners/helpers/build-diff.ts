import { Prisma } from '@generated/prisma-client/client.js';
import { Changes } from '@modules/audit/audit-log-fields.types.js';

type BuildDiffOptions<T extends object> = {
  before?: Partial<T> | null;
  after?: Partial<T> | null;
  sensitiveFields?: (keyof T)[];
};

export const buildChanges = <T extends object>({
  before = null,
  after = null,
  sensitiveFields = [],
}: BuildDiffOptions<T>): Changes<T> => {
  const changes: Changes<T> = {};

  const beforeKeys = before ? (Object.keys(before) as (keyof T)[]) : [];
  const afterKeys = after ? (Object.keys(after) as (keyof T)[]) : [];

  const allKeys = Array.from(new Set([...beforeKeys, ...afterKeys]));

  for (const key of allKeys) {
    const rawFrom = before?.[key] ?? null;
    const rawTo = after?.[key] ?? null;

    const from = toJsonValue(rawFrom);
    const to = toJsonValue(rawTo);

    if (JSON.stringify(from) === JSON.stringify(to)) continue;

    const isSensitive = sensitiveFields.includes(key);

    const censorText = '[REDACTED]';
    changes[key] = { from: isSensitive ? censorText : from, to: isSensitive ? censorText : to };
  }

  return changes;
};

const toJsonValue = (value: unknown): Prisma.JsonValue => {
  if (value instanceof Date) {
    return value.toISOString();
  } else if (Array.isArray(value)) {
    return value.map(toJsonValue);
  } else if (value !== null && typeof value === 'object') {
    const result: Record<string, Prisma.JsonValue> = {};

    for (const [key, nestedValue] of Object.entries(value)) {
      result[key] = toJsonValue(nestedValue);
    }

    return result;
  } else if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null
  ) {
    return value;
  }

  throw new Error(`Value of type "${typeof value}" cannot be converted to Prisma.JsonValue`);
};
