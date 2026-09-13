import { inject, Injectable, Injector } from '@angular/core';
import {
  DefaultTranspiler,
  TranslocoService,
  TranslocoTranspiler,
  TranspileParams,
} from '@jsverse/transloco';
import { IntlMessageFormat } from 'intl-messageformat';

@Injectable()
export class NoEvalTranslocoTranspiler extends DefaultTranspiler implements TranslocoTranspiler {
  private readonly injector = inject(Injector);

  private readonly messageCache = new Map<string, IntlMessageFormat>();

  override transpile({ value, params, translation, key }: TranspileParams): unknown {
    if (typeof value === 'string' && this.isIcuMessage(value)) {
      return this.formatIcuMessage(value, params ?? {});
    }

    return super.transpile({
      value,
      params,
      translation,
      key,
    });
  }

  private isIcuMessage(value: string): boolean {
    return (
      value.includes(', plural,') ||
      value.includes(', select,') ||
      value.includes(', selectordinal,')
    );
  }

  private formatIcuMessage(message: string, params: Record<string, unknown>): string {
    const formatter = this.getFormatter(message);

    return formatter.format(params) as string;
  }

  private getFormatter(message: string): IntlMessageFormat {
    const lang = this.injector.get(TranslocoService).getActiveLang();

    const cacheKey = `${lang}:${message}`;

    let formatter = this.messageCache.get(cacheKey);

    if (!formatter) {
      formatter = new IntlMessageFormat(message, lang);

      this.messageCache.set(cacheKey, formatter);
    }

    return formatter;
  }
}
