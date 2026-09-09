import { SchemaPath, validate } from '@angular/forms/signals';
import { translationMessage } from '@ombro/shared/utils/translation-utils';
import { FORM_ERRORS } from '../form-errors';

export type RegexPatternRule = { forbiddenChars: string[]; regex: RegExp };

export function forbiddenCharsValidator<T>(
  path: SchemaPath<T>,
  options: { message?: string; rule: RegexPatternRule },
) {
  validate(path, ({ value }) => {
    const rawValue = value();
    const stringValue = String(rawValue);

    if (!options.rule.regex.test(stringValue)) {
      const invalidChars = [
        ...new Set([...stringValue].filter((char) => options.rule.forbiddenChars.includes(char))),
      ];
      const formattedChars: string = invalidChars.map(formatChar).join(', ');

      return {
        kind: 'forbiddenChars',
        message:
          options.message ||
          translationMessage(FORM_ERRORS.forbiddenChars.key, {
            [FORM_ERRORS.forbiddenChars.params[0]]: formattedChars,
          }),
      };
    }

    return null;
  });
}

const formatChar = (char: string): string => {
  switch (char) {
    case ' ':
      return '" "';
    default:
      return char;
  }
};
