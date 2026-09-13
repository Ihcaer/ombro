import { Transform } from 'class-transformer';

export function DefaultEnum<T extends Record<string, string | number>>(
  enumObj: T,
  defaultValue: T[keyof T],
) {
  return Transform(({ value }: { value: unknown }) => {
    const allowedValues = Object.values(enumObj) as unknown[];

    if (!value || !allowedValues.includes(value)) {
      return defaultValue;
    } else {
      return value;
    }
  });
}
