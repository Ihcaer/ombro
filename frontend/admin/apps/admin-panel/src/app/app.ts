import { Component, DOCUMENT, effect, inject, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideTranslocoScope, TranslocoService } from '@jsverse/transloco';
import { PrimeNG } from 'primeng/config';
import { PRIMENG_SCOPE } from './core/config/i18n/i18n.config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: `<router-outlet />`,
  providers: [provideTranslocoScope(PRIMENG_SCOPE)],
})
export class App implements OnInit {
  private readonly transloco = inject(TranslocoService);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly primengConfig = inject(PrimeNG);

  private _pageLanguage = effect(() => {
    const activeLanguage = this.transloco.activeLang();
    this.renderer.setAttribute(this.document.documentElement, 'lang', activeLanguage);
  });

  ngOnInit(): void {
    this.transloco
      .selectTranslateObject(PRIMENG_SCOPE)
      .pipe(takeUntilDestroyed())
      .subscribe((translations) => {
        if (translations) this.primengConfig.setTranslation(translations);
      });
  }
}
