import { getBrowserLang } from '@jsverse/transloco';
import { AvailableLanguages, Language } from './i18n.types';

/**
 * List of all languages ​​supported by the application.
 *
 * @remarks
 * **Important:** The first element in this array (`[0]`) is the application's default language (`defaultLang`).
 */
export const AVAILABLE_LANGUAGES: AvailableLanguages = [
  { code: 'en', label: 'English' },
  { code: 'pl', label: 'Polski' },
];

export const availableLanguagesCodes: Language['code'][] = [
  ...new Set(AVAILABLE_LANGUAGES.map((lang) => lang.code)),
];

export const defaultLanguage: Language['code'] =
  availableLanguagesCodes.find((lang) => lang === getBrowserLang()) ?? availableLanguagesCodes[0];

export const LOCAL_STORAGE_LANGUAGE_KEY: string = 'lang';
