import { inject, Service, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

type TranslationParams = Record<string, unknown>;

@Service({ autoProvided: false })
export class TranslocoRootScopeService {
  private readonly transloco = inject(TranslocoService);

  translate(key: string, params?: TranslationParams): Signal<string> {
    return toSignal(this.transloco.selectTranslate(key, params), { initialValue: '' });
  }

  translateObject<T extends object>(key: string, params?: TranslationParams): Signal<T> {
    return toSignal(this.transloco.selectTranslateObject(key, params), { initialValue: {} as T });
  }
}
