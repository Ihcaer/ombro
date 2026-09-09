import { PasswordStrengthScore } from '@ombro/shared/utils/password-strength';

const messageKeyPrefix = 'common.forms.misc.passwordStrength.';

export const passwordStrengthErrorMessage: Readonly<Record<PasswordStrengthScore, string>> = {
  '0': messageKeyPrefix + '0',
  '1': messageKeyPrefix + '1',
  '2': messageKeyPrefix + '2',
  '3': messageKeyPrefix + '3',
  '4': messageKeyPrefix + '4',
} as const;
