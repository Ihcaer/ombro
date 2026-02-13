import {
  isBase64,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AuthTokenService } from '../services/auth-token/auth-token.service';

const EXPECTED_LENGTH: number = Math.ceil((4 * AuthTokenService.ONE_TIME_TOKEN_BYTES) / 3);

@ValidatorConstraint({ name: 'isOneTimeToken', async: false })
export class IsOneTimeTokenConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') return false;

    const isValidBase64Url = isBase64(value, { urlSafe: true });
    if (!isValidBase64Url || value.includes('=') || value.length !== EXPECTED_LENGTH) return false;

    return true;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return `Token ${validationArguments.property} has invalid format or length.`;
  }
}

export const IsOneTimeToken = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsOneTimeTokenConstraint,
    });
  };
};
