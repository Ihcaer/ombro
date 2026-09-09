import { Component, inject, linkedSignal, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AVAILABLE_LANGUAGES } from '@ombro/admin-panel/app/core/config/i18n/i18n.config';
import { AvailableLanguages, Language } from '@ombro/admin-panel/app/core/config/i18n/i18n.types';
import { RadioButton } from 'primeng/radiobutton';
import { DialogComponent } from '@ombro/shared/ui/ui-primitives';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-language-change-dialog',
  imports: [RadioButton, FormsModule, DialogComponent, TranslocoPipe],
  templateUrl: './language-change-dialog.component.html',
})
export class LanguageChangeDialogComponent {
  private transloco = inject(TranslocoService);

  isVisible = model.required<boolean>();

  protected languages: AvailableLanguages = structuredClone(AVAILABLE_LANGUAGES);
  protected selectedLang = linkedSignal(() => this.transloco.activeLang());

  protected getRadioId(suffix: string): string {
    return 'lang-change-radio-' + suffix;
  }

  protected onLanguageChange(lang: Language['code']): void {
    if (lang) this.transloco.setActiveLang(lang);
  }
}
