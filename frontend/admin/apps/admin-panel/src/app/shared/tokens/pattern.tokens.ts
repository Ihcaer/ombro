import { RegexPatternRule } from '@ombro/shared/ui/ui-forms';
import { InjectionToken } from '@angular/core';
import { AdminDto } from '@ombro/shared/data-access/api-client';

type RegexMap<T> = Partial<Record<keyof T, RegexPatternRule>>;

const AUTH_PATTERNS: RegexMap<AdminDto & { email: string }> = {
  email: { forbiddenChars: [' '], regex: /^\S*$/ },
  handleName: { forbiddenChars: ['@', ' '], regex: /^[^@ ]*$/ },
} as const;

export const REGEX_PATTERNS = new InjectionToken('regexPatterns', {
  providedIn: 'root',
  factory: () => ({ auth: AUTH_PATTERNS }),
});
