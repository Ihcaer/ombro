import { checkPasswordStrengthUtil } from './check-password-strength.util';

describe('checkPasswordStrengthUtil()', () => {
  it.each([
    {
      password: 'correct-horse-battery-staple-2026',
      expected: true,
      passwordStrength: 'strong',
    },
    { password: 'password', expected: false, passwordStrength: 'weak' },
  ])('should return $expected when password is $passwordStrength', ({ password, expected }) => {
    expect(checkPasswordStrengthUtil(password)).toBe(expected);
  });
});
