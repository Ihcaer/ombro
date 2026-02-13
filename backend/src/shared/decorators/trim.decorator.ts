import { Transform, TransformFnParams } from 'class-transformer';

export const Trim = () => {
  return Transform(({ value }: TransformFnParams): unknown => {
    if (value === null || value === undefined) return value;
    return typeof value === 'string' ? value.trim() : value;
  });
};
