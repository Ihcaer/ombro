import {
  registerDecorator,
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

  defaultMessage(): string {
    return `The value of these privileges does not exist.`;
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
