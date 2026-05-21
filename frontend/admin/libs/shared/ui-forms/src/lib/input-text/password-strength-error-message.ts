import { PasswordStrengthScore } from '@ombro/shared/utils/password-strength';

export const passwordStrengthErrorMessage: Readonly<Record<PasswordStrengthScore, string>> = {
  '0': 'Bardzo słabe',
  '1': 'Słabe',
  '2': 'Średnie',
  '3': 'Mocne',
  '4': 'Bardzo mocne',
} as const;
