import { InjectionToken } from '@angular/core';
import { PasswordStrengthScore } from '@ombro/shared/utils/password-strength';
import { MIN_PASSWORD_STRENGTH } from '../auth/auth.constants';

export const PASSWORD_STRENGTH_THRESHOLD = new InjectionToken<PasswordStrengthScore>(
  'PasswordStrengthThreshold',
  { providedIn: 'root', factory: () => MIN_PASSWORD_STRENGTH },
);
