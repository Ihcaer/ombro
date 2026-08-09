import { ApiResponseOptions } from '@nestjs/swagger';

export const errorResponseExamples = (
  errors: Array<{ errorCode?: string; message: string }>,
): ApiResponseOptions['content'] => {
  const examples: Record<string, { value: any }> = {};

  errors.forEach((err, index) => {
    const key = err.errorCode || `Error_${index + 1}`;

    examples[key] = {
      value: err.errorCode
        ? { errorCode: err.errorCode, message: err.message }
        : { message: err.message },
    };
  });

  return { 'application/json': { examples } };
};
