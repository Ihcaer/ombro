import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OneTimeTokenStore } from '@ombro/admin-panel/app/shared/data-access/one-time-token';
import { PasswordResetBase } from '../password-reset-base';
import {
  InputTextComponent,
  matchFieldsValidator,
  passwordStrengthValidator,
} from '@ombro/shared/ui/ui-forms';
import { AuthWrapperComponent } from '../../../components/auth-wrapper/auth-wrapper.component';
import { MessageModule } from 'primeng/message';
import { FormButtonsComponent } from '../../../components/form-buttons/form-buttons.component';
import { PasswordStrengthScore } from '@ombro/shared/utils/password-strength';
import { PASSWORD_STRENGTH_THRESHOLD } from '@ombro/admin-panel/app/core/tokens/security.tokens';
import { translateSignal, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FieldTree, form, required, FormRoot, FormField } from '@angular/forms/signals';

type ResetPasswordForm = {
  newPassword: string;
  confirmNewPassword: string;
};

@Component({
  selector: 'app-reset-password',
  imports: [
    AuthWrapperComponent,
    MessageModule,
    RouterLink,
    InputTextComponent,
    FormButtonsComponent,
    TranslocoDirective,
    FormRoot,
    FormField,
  ],
  providers: [OneTimeTokenStore],
  templateUrl: './reset-password.component.html',
  styles: `
    @use '../../../styles/common.scss';
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent extends PasswordResetBase implements OnInit {
  protected readonly minPasswordStrength = inject(PASSWORD_STRENGTH_THRESHOLD);
  private readonly oneTimeTokenStore = inject(OneTimeTokenStore);
  private readonly route = inject(ActivatedRoute);
  private readonly transloco = inject(TranslocoService);

  private passwordStrengthScore = signal<PasswordStrengthScore>(0);

  private passwordFieldTranslation = translateSignal(
    'common.entities.user.password',
    undefined,
    this.transloco.activeLang(),
  );

  protected override model: WritableSignal<ResetPasswordForm> = signal({
    newPassword: '',
    confirmNewPassword: '',
  });

  protected override form: FieldTree<ResetPasswordForm, string | number, 'writable'> = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.newPassword, { message: this.requiredErrorMessage });
      passwordStrengthValidator(schemaPath.newPassword, {
        passwordScore: this.passwordStrengthScore.asReadonly(),
        minPasswordStrength: this.minPasswordStrength,
      });
      required(schemaPath.confirmNewPassword, { message: this.requiredErrorMessage });
      matchFieldsValidator(schemaPath.confirmNewPassword, {
        originalField: schemaPath.newPassword,
        originalFieldName: this.passwordFieldTranslation,
      });
    },
    {
      submission: {
        action: async (field) => {
          if (this.oneTimeTokenStore.hasToken()) {
            const password = field.newPassword().value();
            const token = this.oneTimeTokenStore.oneTimeToken()!;

            this.authStore.resetPassword({ token, password });
            this.showSuccess.set(true);
          } else {
            this.showSuccess.set(false);
          }
        },
        onInvalid: () => {
          this.showSuccess.set(false);
        },
      },
    },
  );

  ngOnInit(): void {
    this.oneTimeTokenStore.initializeFromRoute(this.route.snapshot);
  }

  protected handlePasswordStrength(score: PasswordStrengthScore): void {
    this.passwordStrengthScore.set(score);
  }
}
