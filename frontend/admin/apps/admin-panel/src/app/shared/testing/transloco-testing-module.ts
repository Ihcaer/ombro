import { TranslocoTestingModule, TranslocoTestingOptions } from '@jsverse/transloco';
import { availableLanguagesCodes } from '../../core/config/i18n/i18n.config';
import en from '../../../assets/i18n/en.json';
import enPrimeNg from '../../../assets/i18n/primeng/en.json';
import enAuth from '../../../assets/i18n/auth/en.json';
import enPanel from '../../../assets/i18n/panel/en.json';
import enPanelDashboard from '../../../assets/i18n/panel/dashboard/en.json';
import pl from '../../../assets/i18n/pl.json';
import plPrimeNg from '../../../assets/i18n/primeng/pl.json';
import plAuth from '../../../assets/i18n/auth/pl.json';
import plPanel from '../../../assets/i18n/panel/pl.json';
import plPanelDashboard from '../../../assets/i18n/panel/dashboard/pl.json';

export function getTranslocoTestingModule(options: TranslocoTestingOptions = {}) {
  const { langs, translocoConfig, ...rest } = options;
  return TranslocoTestingModule.forRoot({
    langs: {
      en,
      'primeng/en': enPrimeNg,
      'auth/en': enAuth,
      'panel/en': enPanel,
      'panel/dashboard/en': enPanelDashboard,
      pl,
      'primeng/pl': plPrimeNg,
      'auth/pl': plAuth,
      'panel/pl': plPanel,
      'panel/dashboard/pl': plPanelDashboard,
      ...langs,
    },
    translocoConfig: {
      availableLangs: availableLanguagesCodes,
      defaultLang: availableLanguagesCodes[0],
      ...translocoConfig,
      reRenderOnLangChange: true,
    },
    preloadLangs: true,
    ...rest,
  });
}
