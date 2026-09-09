import { SchemaPath, validate } from '@angular/forms/signals';
import { PasswordStrengthScore } from '@ombro/shared/utils/password-strength';
import { translationMessage } from '@ombro/shared/utils/translation-utils';
import { FORM_ERRORS } from '../form-errors';
import { Signal } from '@angular/core';

export function passwordStrengthValidator(
  path: SchemaPath<string>,
  options: {
    message?: string;
    passwordScore: Signal<PasswordStrengthScore>;
    minPasswordStrength: PasswordStrengthScore;
  },
) {
  validate(path, () => {
    const passwordScore = options.passwordScore();

    if (passwordScore < options.minPasswordStrength) {
      return {
        kind: 'weakPassword',
        message: options.message || translationMessage(FORM_ERRORS.weakPassword.key),
      };
    }

    return null;
  });
}
