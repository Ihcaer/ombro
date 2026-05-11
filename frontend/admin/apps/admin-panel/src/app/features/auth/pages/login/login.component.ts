import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AuthWrapperComponent } from '../../components/auth-wrapper/auth-wrapper.component';
import { FormButtonsComponent } from '../../components/form-buttons/form-buttons.component';
import { InputTextComponent } from '@ombro/shared/ui-forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '@ombro/admin-panel/app/core/auth/auth.store';
import { MessageModule } from 'primeng/message';
import { ErrorResponseBody } from '@ombro/admin-panel/app/core/config/types/error-response-body.type';

type LoginForm = { login: FormControl<string>; password: FormControl<string> };

@Component({
  selector: 'app-login',
  imports: [
    AuthWrapperComponent,
    FormButtonsComponent,
    InputTextComponent,
    ReactiveFormsModule,
    MessageModule,
  ],
  templateUrl: './login.component.html',
  styles: `
    @use '../../styles/common.scss';
    .form-fields {
      display: flex;
      flex-direction: column;
      gap: common.$formFieldsGap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authStore = inject(AuthStore);

  protected errorMessage = signal<string | null>(null);

  protected loginForm = new FormGroup<LoginForm>({
    login: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\S*$/)],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected readonly getErrorMessage = computed<string | null>(() => {
    const errorBody = this.authStore.lastError()?.error as ErrorResponseBody | undefined;
    if (!errorBody) return null;
    const errorCode = errorBody.errorCode;
    let errorMessage: string;

    switch (errorCode) {
      case 'INVALID_CREDENTIALS':
        errorMessage = 'Nieprawidłowe dane uwierzytelniające.';
        break;
      case 'EMAIL_NOT_VERIFIED':
        errorMessage =
          'E-mail niezweryfikowany. W celu weryfikacji postępuj zgodnie z instrukcjami przesłanymi na e-mail.';
        break;
      default:
        errorMessage = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie za chwilę.';
    }

    return errorMessage;
  });

  protected onSubmit() {
    if (this.loginForm.valid) {
      const rawValues = this.loginForm.getRawValue();

      this.authStore.login({
        identifier: rawValues.login,
        password: rawValues.password,
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
