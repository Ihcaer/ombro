import { Component, DestroyRef, DOCUMENT, effect, inject, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { PrimeNG } from 'primeng/config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: `<router-outlet />`,
})
export class App implements OnInit {
  private readonly transloco = inject(TranslocoService);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly primengConfig = inject(PrimeNG);
  private readonly destroyRef = inject(DestroyRef);

  private _pageLanguage = effect(() => {
    const activeLanguage = this.transloco.activeLang();
    this.renderer.setAttribute(this.document.documentElement, 'lang', activeLanguage);
  });

  ngOnInit(): void {
    this.loadTransloco();
  }

  private loadTransloco(): void {
    this.transloco
      .load(this.transloco.getActiveLang())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    // Primeng scope is auto detected
    this.transloco
      .selectTranslateObject('')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((translations) => {
        if (translations) this.primengConfig.setTranslation(translations);
      });
  }
}
