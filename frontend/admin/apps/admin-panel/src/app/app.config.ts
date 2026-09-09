import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { DefaultPreset } from '@ombro/themes';
import { provideMaterialSymbols } from '@ombro/shared/ui/ui-icons';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/auth/interceptors/auth/auth.interceptor';
import { apiPrefixInterceptor } from './core/auth/interceptors/api-prefix/api-prefix.interceptor';
import { adminTokenInterceptor } from './core/auth/interceptors/admin-token/admin-token.interceptor';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { provideTranslocoPersistLang } from '@jsverse/transloco-persist-lang';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';
import {
  availableLanguagesCodes,
  defaultLanguage,
  LOCAL_STORAGE_LANGUAGE_KEY,
} from './core/config/i18n/i18n.config';
import { environment } from '../environments/environment.example';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(
      withInterceptors([authInterceptor, apiPrefixInterceptor, adminTokenInterceptor]),
    ),
    providePrimeNG({
      theme: {
        preset: DefaultPreset,
        options: {
          darkModeSelector: '.dark-mode',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
      license: environment.primeUiLicenseKey,
    }),
    provideMaterialSymbols(),
    provideTransloco({
      config: {
        availableLangs: availableLanguagesCodes,
        defaultLang: defaultLanguage,
        fallbackLang: availableLanguagesCodes[0],
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        flatten: { aot: !isDevMode() },
      },
      loader: TranslocoHttpLoader,
    }),
    provideTranslocoPersistLang({
      storageKey: LOCAL_STORAGE_LANGUAGE_KEY,
      storage: { useValue: localStorage },
    }),
    provideTranslocoMessageformat(),
  ],
};
