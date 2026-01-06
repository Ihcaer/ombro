import { ClassConstructor, plainToInstance } from 'class-transformer';
import {
  validateSync,
  ValidationError,
  ValidatorOptions,
} from 'class-validator';

export const validateConfig = <T extends object>(
  envClass: ClassConstructor<T>,
): T => {
  const validatedConfig = plainToInstance(envClass, process.env, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });

  const validatorOptions: ValidatorOptions = {
    whitelist: true,
    forbidNonWhitelisted: false,
    forbidUnknownValues: true,
    validationError: { target: false },
  };

  const errors = validateSync(validatedConfig, validatorOptions);

  if (errors.length > 0) {
    throw new Error(
      `[Config validation error] in section ${envClass.name}:\n${formatErrors(errors)}`,
    );
  }
  return validatedConfig;
};

const formatErrors = (errors: ValidationError[]): string => {
  return errors
    .map((err) => {
      const constraints = Object.values(err.constraints || {}).join(', ');
      return `- ${err.property}: ${constraints}`;
    })
    .join('\n');
};
