import { RegexPatternRule } from '@ombro/shared/ui-forms';
import { Admin } from '../../core/auth/types/admin-data.types';
import { InjectionToken } from '@angular/core';

type RegexMap<T> = Partial<Record<keyof T, RegexPatternRule>>;

const AUTH_PATTERNS: RegexMap<Admin> = {
  email: { forbiddenChars: [' '], regex: /^\S*$/ },
  handleName: { forbiddenChars: ['@', ' '], regex: /^[^@ ]*$/ },
} as const;

export const REGEX_PATTERNS = new InjectionToken('regexPatterns', {
  providedIn: 'root',
  factory: () => ({ auth: AUTH_PATTERNS }),
});
