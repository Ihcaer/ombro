import { Directive, inject, Signal, WritableSignal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { AuthStore } from '@ombro/admin-panel/app/core/auth/store';
import { FORM_ERRORS } from '@ombro/shared/ui/ui-forms';
import { translationMessage } from '@ombro/shared/utils/translation-utils';

@Directive()
export abstract class AuthPageBase {
  protected readonly authStore = inject(AuthStore);

  protected isLoading: Signal<boolean> = this.authStore.isLoading;
  protected requiredErrorMessage: string = translationMessage(FORM_ERRORS.required.key);

  protected abstract model: WritableSignal<unknown>;
  protected abstract form: FieldTree<unknown, string | number, 'writable'>;
}
