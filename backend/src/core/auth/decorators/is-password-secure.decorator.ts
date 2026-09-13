import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject } from '@nestjs/common';
import { PASSWORD_STRENGTH_VALIDATOR } from '../providers/password-strength.provider';
import type { PasswordStrengthValidatorFn } from '../providers/password-strength.provider';

@ValidatorConstraint({ name: 'IsSecurePasswordConstraint', async: false })
export class IsSecurePasswordConstraint implements ValidatorConstraintInterface {
  constructor(
    @Inject(PASSWORD_STRENGTH_VALIDATOR)
    private readonly isPasswordStrong: PasswordStrengthValidatorFn,
  ) {}

  validate(value: unknown, validationArguments: ValidationArguments): boolean {
    if (typeof value !== 'string') return false;

    const [fields] = validationArguments.constraints as [string[]];
    const dto = validationArguments.object as Record<string, unknown>;

    const valuesFromDto = fields.filter((field) => {
      const val = dto[field];
      return typeof val === 'string';
    });

    return this.isPasswordStrong(value, valuesFromDto);
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
