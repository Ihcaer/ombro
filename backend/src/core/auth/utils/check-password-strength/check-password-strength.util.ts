import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import { adjacencyGraphs, dictionary } from '@zxcvbn-ts/language-common';
import { dictionary as enDictionary } from '@zxcvbn-ts/language-en';
import { dictionary as plDictionary } from '@zxcvbn-ts/language-pl';

zxcvbnOptions.setOptions({
  dictionary: { ...dictionary, ...enDictionary, ...plDictionary },
  graphs: adjacencyGraphs,
});

const MAX_DATA_LENGTH = 60;

export const checkPasswordStrengthUtil = (
  password: string,
  inputs?: (string | undefined | null)[],
): boolean => {
  if (password.length > 100) return false;

  const emailRegex: RegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-\u00A0-\u017F]+@[a-zA-Z0-9.\u00A0-\u017F-]+\.[a-zA-Z\u00A0-\u017F]{2,}$/u;

  const sanitizedInputs: string[] = (inputs ?? [])
    .filter(
      (i): i is string => typeof i === 'string' && i.length > 3 && i.length <= MAX_DATA_LENGTH,
    )
    .map((i) => {
      return emailRegex.test(i) ? i.split('@')[0] : i;
    });

  const result = zxcvbn(password, sanitizedInputs);
  return result.score >= 3;
};
