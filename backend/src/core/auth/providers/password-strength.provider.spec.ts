import { Test, TestingModule } from '@nestjs/testing';
import {
  PASSWORD_STRENGTH_VALIDATOR,
  PasswordStrengthProvider,
  PasswordStrengthValidatorFn,
} from './password-strength.provider';

describe('PasswordStrengthProvider', () => {
  let isPasswordStrong: PasswordStrengthValidatorFn;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordStrengthProvider],
    }).compile();

    isPasswordStrong = module.get<PasswordStrengthValidatorFn>(PASSWORD_STRENGTH_VALIDATOR);
  });

  it.each([
    {
      password: 'correct-horse-battery-staple-2026',
      expected: true,
      passwordStrength: 'strong',
    },
    { password: 'password', expected: false, passwordStrength: 'weak' },
  ])('should return $expected when password is $passwordStrength', ({ password, expected }) => {
    expect(isPasswordStrong(password)).toBe(expected);
  });
});
