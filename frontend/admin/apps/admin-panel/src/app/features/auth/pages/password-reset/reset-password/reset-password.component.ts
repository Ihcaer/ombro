import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OneTimeTokenStore } from '@ombro/admin-panel/app/shared/data-access/one-time-token';
import { PasswordResetBase } from '../password-reset-base';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  matchFieldsValidator,
  InputTextComponent,
  passwordStrengthValidator,
} from '@ombro/shared/ui/ui-forms';
import { AuthWrapperComponent } from '../../../components/auth-wrapper/auth-wrapper.component';
import { MessageModule } from 'primeng/message';
import { FormButtonsComponent } from '../../../components/form-buttons/form-buttons.component';
import { PasswordStrengthScore } from '@ombro/shared/utils/password-strength';
import { PASSWORD_STRENGTH_THRESHOLD } from '@ombro/admin-panel/app/core/tokens/security.tokens';

type ResetPasswordForm = {
  newPassword: FormControl<string>;
  confirmNewPassword: FormControl<string>;
};

@Component({
  selector: 'app-reset-password',
  imports: [
    AuthWrapperComponent,
    MessageModule,
    RouterLink,
    ReactiveFormsModule,
    InputTextComponent,
    FormButtonsComponent,
  ],
  providers: [OneTimeTokenStore],
  templateUrl: './reset-password.component.html',
  styles: `
    @use '../../../styles/common.scss';
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent extends PasswordResetBase implements OnInit {
  private readonly oneTimeTokenStore = inject(OneTimeTokenStore);
  private readonly route = inject(ActivatedRoute);
  protected readonly minPasswordStrength = inject(PASSWORD_STRENGTH_THRESHOLD);

  private passwordStrengthScore: PasswordStrengthScore = 0;

  protected resetPasswordForm = new FormGroup<ResetPasswordForm>(
    {
      newPassword: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          passwordStrengthValidator(() => this.passwordStrengthScore, this.minPasswordStrength),
        ],
      }),
      confirmNewPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: matchFieldsValidator(['newPassword', 'confirmNewPassword']) },
  );

  ngOnInit(): void {
    this.oneTimeTokenStore.initializeFromRoute(this.route.snapshot);
  }

  protected override onSubmit(): void {
    if (this.resetPasswordForm.valid && this.oneTimeTokenStore.hasToken()) {
      const password = this.resetPasswordForm.value.newPassword!;
      const token = this.oneTimeTokenStore.oneTimeToken()!;

      this.authStore.resetPassword({ token, password });
      this.showSuccess.set(true);
    } else {
      this.showSuccess.set(false);
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  protected handlePasswordStrength(score: PasswordStrengthScore): void {
    this.passwordStrengthScore = score;
    this.resetPasswordForm.get('password')?.updateValueAndValidity();
  }
}
