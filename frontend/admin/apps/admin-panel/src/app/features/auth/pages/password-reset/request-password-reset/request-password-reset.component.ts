import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthWrapperComponent } from '../../../components/auth-wrapper/auth-wrapper.component';
import { FormButtonsComponent } from '../../../components/form-buttons/form-buttons.component';
import { InputTextComponent } from '@ombro/shared/ui-forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { PasswordResetBase } from '../password-reset-base';

@Component({
  selector: 'app-request-password-reset',
  imports: [
    AuthWrapperComponent,
    FormButtonsComponent,
    InputTextComponent,
    ReactiveFormsModule,
    MessageModule,
  ],
  templateUrl: './request-password-reset.component.html',
  styles: `
    @use '../../../styles/common.scss';
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestPasswordResetComponent extends PasswordResetBase {
  private readonly router = inject(Router);

  protected requestPasswordResetForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\S*$/), Validators.email],
    }),
  });

  protected override onSubmit(): void {
    if (this.requestPasswordResetForm.valid) {
      const rawValues = this.requestPasswordResetForm.getRawValue();
      this.authStore.requestPasswordReset({ email: rawValues.email });
      this.showSuccess = true;
    } else {
      this.showSuccess = false;
      this.requestPasswordResetForm.markAllAsTouched();
    }
  }

  protected onCancel(): void {
    this.router.navigate([this.LOGIN_LINK]);
  }
}
