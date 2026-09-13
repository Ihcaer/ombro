import { Transform } from 'class-transformer';

export const ToBoolean = (): PropertyDecorator => {
  return Transform(({ value }: { value: unknown }): unknown => {
    if (value === 'true' || value === '1') {
      return true;
    } else if (value === 'false' || value === '0') {
      return false;
    } else {
      return value;
    }
  });
};

export const ToNumber = (): PropertyDecorator => {
  return Transform(({ value }: { value: unknown }): unknown => {
    if (typeof value === 'number') {
      return value;
    } else if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    } else {
      return value;
    }
  });
};
