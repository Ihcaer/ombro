import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { checkPasswordStrengthUtil } from '../utils/check-password-strength/check-password-strength.util';

@ValidatorConstraint({ name: 'IsSecurePasswordConstraint', async: false })
export class IsSecurePasswordConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, validationArguments: ValidationArguments): boolean {
    if (typeof value !== 'string') return false;

    const [fields] = validationArguments.constraints as [string[]];
    const dto = validationArguments.object as Record<string, unknown>;

    const valuesFromDto = fields.map((field) => {
      const val = dto[field];
      return typeof val === 'string' ? val : null;
    });

    return checkPasswordStrengthUtil(value, valuesFromDto);
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    const [fields] = validationArguments.constraints as [string[]];
    return fields.length > 0
      ? 'The password is too weak or contains data from the following fields: ' + fields.join(', ')
      : 'The password is too weak.';
  }
}

export const IsSecurePassword = (fields: string[] = [], validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [fields],
      validator: IsSecurePasswordConstraint,
    });
  };
};

/* export const IsPasswordSecure = (
  fieldsToCompare: string[] = [],
  validationOptions?: ValidationOptions,
) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [fieldsToCompare],
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          const [fields] = args.constraints as [string[]];
          const dto = args.object as Record<string, unknown>;

          const valuesFromDto = fields.map((field) => {
            const val = dto[field];
            return typeof val === 'string' ? val : null;
          });

          return checkPasswordStrengthUtil(value, valuesFromDto);
        },
        defaultMessage: (args: ValidationArguments) => {
          const [fields] = args.constraints as [string[]];
          return fields.length > 0
            ? 'The password is too weak or contains data from the following fields: ' +
                fields.join(', ')
            : 'The password is too weak.';
        },
      },
    });
  };
}; */
