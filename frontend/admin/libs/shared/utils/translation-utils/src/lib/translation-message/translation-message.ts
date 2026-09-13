import { TranslationMessage } from './translation-message.types';

const SEPARATOR = '|';

export const translationMessage = (key: string, params?: Record<string, unknown>): string => {
  if (params === undefined) return key;
  return `${key}${SEPARATOR}${JSON.stringify(params)}`;
};

export const parseTranslationMessage = (message: string): TranslationMessage => {
  const separatorIndex = message.indexOf(SEPARATOR);
  if (separatorIndex === -1) return { key: message };

  const key = message.slice(0, separatorIndex);
  if (!key) throw new Error('Invalid translation message: translation key is empty.');
  const params = message.slice(separatorIndex + SEPARATOR.length);

  return { key, params: JSON.parse(params) };
};
