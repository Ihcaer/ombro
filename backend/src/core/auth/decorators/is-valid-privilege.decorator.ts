import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrivilegesUtils } from '../utils/privileges.utils';

@ValidatorConstraint({ name: 'isValidPrivileges', async: false })
export class IsValidPrivilegeConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'number' && PrivilegesUtils.isValid(value);
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return `The value ${validationArguments.value} is not a valid permission mask (it contains non-existent bits).`;
  }
}

export function IsValidPrivilege(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPrivilegeConstraint,
    });
  };
}
