import { Provider } from '@nestjs/common';
import { Options, ZxcvbnFactory, ZxcvbnResult } from '@zxcvbn-ts/core';
import { adjacencyGraphs, dictionary as commonDictionary } from '@zxcvbn-ts/language-common';
import { dictionary as enDictionary, translations as enTranslations } from '@zxcvbn-ts/language-en';
import { dictionary as plDictionary, translations as plTranslations } from '@zxcvbn-ts/language-pl';

export const PASSWORD_STRENGTH_VALIDATOR = 'PASSWORD_STRENGTH_VALIDATOR';

export type PasswordStrengthValidatorFn = (
  password: string,
  inputs?: (string | number)[],
) => boolean;

const configureZxcvbn = (): PasswordStrengthValidatorFn => {
  const minimalPasswordStrength: ZxcvbnResult['score'] = 3;

  const options: Partial<Options> = {
    dictionary: { ...commonDictionary, ...enDictionary, ...plDictionary },
    graphs: { ...adjacencyGraphs },
    useLevenshteinDistance: true,
    translations: { ...enTranslations, ...plTranslations },
  };

  const zxcvbn = new ZxcvbnFactory(options);

  return (password: string, inputs?: (string | number)[]): boolean => {
    const result = zxcvbn.check(password, inputs);
    return result.score >= minimalPasswordStrength;
  };
};

export const PasswordStrengthProvider: Provider = {
  provide: PASSWORD_STRENGTH_VALIDATOR,
  useValue: configureZxcvbn(),
};
