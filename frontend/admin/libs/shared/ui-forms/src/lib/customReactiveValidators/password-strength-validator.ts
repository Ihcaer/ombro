import { AbstractControl, ValidationErrors } from '@angular/forms';
import { PasswordStrengthScore } from '@ombro/shared/utils/password-strength';

export const WEAK_PASSWORD_ERROR_KEY = 'weakPassword' as const;

export const passwordStrengthValidator = (
  getPasswordScore: () => PasswordStrengthScore,
  minPasswordStrength: PasswordStrengthScore,
) => {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordScore = getPasswordScore();
    return passwordScore < minPasswordStrength ? { [WEAK_PASSWORD_ERROR_KEY]: true } : null;
  };
};
