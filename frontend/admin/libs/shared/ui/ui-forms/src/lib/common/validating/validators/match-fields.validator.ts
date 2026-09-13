import { SchemaPath, validate } from '@angular/forms/signals';
import { translationMessage } from '@ombro/shared/utils/translation-utils';
import { FORM_ERRORS } from '../form-errors';
import { Signal } from '@angular/core';

export function matchFieldsValidator<T>(
  path: SchemaPath<T>,
  options: {
    message?: string;
    originalField: SchemaPath<T>;
    originalFieldName: Signal<string>;
  },
) {
  validate(path, ({ value, valueOf }) => {
    if (value() !== valueOf(options.originalField)) {
      return {
        kind: 'matchFields',
        message:
          options.message ||
          translationMessage(FORM_ERRORS.matchFields.key, {
            [FORM_ERRORS.matchFields.params[0]]: options.originalFieldName(),
          }),
      };
    }

    return null;
  });
}
