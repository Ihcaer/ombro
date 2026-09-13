import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { AuthWrapperComponent } from '../../../components/auth-wrapper/auth-wrapper.component';
import { FormButtonsComponent } from '../../../components/form-buttons/form-buttons.component';
import { FORM_ERRORS, InputTextComponent } from '@ombro/shared/ui/ui-forms';
import { Router } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { PasswordResetBase } from '../password-reset-base';
import { ButtonDirective } from 'primeng/button';
import { takeWhile, tap, timer } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { email, FieldTree, form, required, FormRoot, FormField } from '@angular/forms/signals';
import { translationMessage } from '@ombro/shared/utils/translation-utils';

type RequestPasswordResetForm = { email: string };

@Component({
  selector: 'app-request-password-reset',
  imports: [
    AuthWrapperComponent,
    FormButtonsComponent,
    InputTextComponent,
    MessageModule,
    ButtonDirective,
    DatePipe,
    TranslocoDirective,
    FormRoot,
    FormField,
  ],
  templateUrl: './request-password-reset.component.html',
  styles: `
    @use '../../../styles/common.scss';
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestPasswordResetComponent extends PasswordResetBase {
  private static readonly cooldownTimeMs: number = 30000;

  private readonly router = inject(Router);

  protected cooldownMs = signal<number>(0);

  protected override model: WritableSignal<RequestPasswordResetForm> = signal({ email: '' });

  protected override form: FieldTree<RequestPasswordResetForm, string | number, 'writable'> = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.email, { message: this.requiredErrorMessage });
      email(schemaPath.email, { message: translationMessage(FORM_ERRORS.email.key) });
    },
    {
      submission: {
        action: async () => {
          this.submit();
        },
        onInvalid: () => {
          this.invalid();
        },
      },
    },
  );

  protected isOnCooldown = computed<boolean>(() => this.cooldownMs() > 0);

  protected resend(): void {
    if (this.form().valid()) this.submit();
    this.setClickCooldown();
  }

  protected onCancel(): void {
    this.router.navigate([this.LOGIN_LINK]);
  }

  private submit(): void {
    const email = this.form.email().value();
    this.authStore.requestPasswordReset({ email });
    this.showSuccess.set(true);
  }

  private invalid(): void {
    this.showSuccess.set(false);
  }

  private setClickCooldown(): void {
    if (this.cooldownMs() > 0) return;

    this.cooldownMs.set(RequestPasswordResetComponent.cooldownTimeMs);

    timer(1000, 1000)
      .pipe(
        tap(() => this.cooldownMs.update((ms) => ms - 1000)),
        takeWhile(() => this.cooldownMs() > 0),
      )
      .subscribe();
  }
}
