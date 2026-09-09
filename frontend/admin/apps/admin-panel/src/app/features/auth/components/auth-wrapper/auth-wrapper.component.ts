import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { IconComponent, IconName } from '@ombro/shared/ui/ui-icons';
import { LogoComponent } from '@ombro/admin-panel/app/shared/components/logo/logo.component';
import { MessageModule } from 'primeng/message';
import { AuthStore } from '@ombro/admin-panel/app/core/auth/store/auth.store';
import { mapAuthHttpErrorToMessage } from '../../utils/mapAuthHttpErrorToMessage.util';
import { ErrorResponseBody } from '@ombro/admin-panel/app/core/config/types/error-response-body.type';
import { TranslocoService } from '@jsverse/transloco';
import { AVAILABLE_LANGUAGES } from '@ombro/admin-panel/app/core/config/i18n/i18n.config';
import { AvailableLanguages, Language } from '@ombro/admin-panel/app/core/config/i18n/i18n.types';
import { SelectComponent } from '@ombro/shared/ui/ui-forms';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { LanguageChangeDialogComponent } from '@ombro/admin-panel/app/shared/components/language-change-dialog/language-change-dialog.component';

@Component({
  selector: 'app-auth-wrapper',
  imports: [
    IconComponent,
    LogoComponent,
    MessageModule,
    SelectComponent,
    FormsModule,
    NgTemplateOutlet,
    LanguageChangeDialogComponent,
  ],
  templateUrl: './auth-wrapper.component.html',
  styles: `
    @use '../../styles/common.scss';
    .heading {
      margin-bottom: common.$elementsGap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthWrapperComponent {
  private readonly authStore = inject(AuthStore);
  private readonly transloco = inject(TranslocoService);

  /**  @see {@link IconComponent} */
  readonly icon = input<IconName>();

  protected languagesList = signal<AvailableLanguages>([...AVAILABLE_LANGUAGES]);
  protected selectedLang = linkedSignal(() => this.transloco.activeLang());
  protected isLanguageDialogOpen = signal<boolean>(false);

  protected languageObjectKeys: Record<keyof Language, keyof Language> = {
    code: 'code',
    label: 'label',
  };

  protected errorMessage = computed<string | null>(() => {
    const errorBody = this.authStore.lastResponseError()?.error as ErrorResponseBody | null;
    if (!errorBody) return null;
    const errorCode = errorBody.errorCode;

    return mapAuthHttpErrorToMessage(errorCode);
  });

  protected onLanguageChange(newLang: Language['code']): void {
    if (newLang) this.transloco.setActiveLang(newLang);
  }
}
