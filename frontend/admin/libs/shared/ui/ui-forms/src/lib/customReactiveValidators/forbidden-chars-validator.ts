import { AbstractControl, ValidationErrors } from '@angular/forms';

export type RegexPatternRule = { forbiddenChars: string[]; regex: RegExp };

export const FORBIDDEN_CHAR_ERROR_KEY = 'forbiddenChar';

export const forbiddenCharsValidator = (rule: RegexPatternRule) => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value || rule.regex.test(value)) return null;

    const invalidChars = [
      ...new Set([...value].filter((char) => rule.forbiddenChars.includes(char))),
    ];
    const formattedChars = invalidChars.map(formatChar);

    return { [FORBIDDEN_CHAR_ERROR_KEY]: { invalidChars: formattedChars } };
  };
};

const formatChar = (char: string): string => {
  switch (char) {
    case ' ':
      return '" "';
    default:
      return char;
  }
};
