import { provideTransloco } from '@jsverse/transloco';

export const provideDumbTranslocoForTests = () =>
  provideTransloco({ config: { availableLangs: ['en'], defaultLang: 'en', fallbackLang: 'en' } });
