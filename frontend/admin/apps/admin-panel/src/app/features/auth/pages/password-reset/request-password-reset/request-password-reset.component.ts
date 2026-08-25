import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AuthWrapperComponent } from '../../../components/auth-wrapper/auth-wrapper.component';
import { FormButtonsComponent } from '../../../components/form-buttons/form-buttons.component';
import { InputTextComponent } from '@ombro/shared/ui/ui-forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { PasswordResetBase } from '../password-reset-base';
import { ButtonDirective } from 'primeng/button';
import { takeWhile, tap, timer } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-request-password-reset',
  imports: [
    AuthWrapperComponent,
    FormButtonsComponent,
    InputTextComponent,
    ReactiveFormsModule,
    MessageModule,
    ButtonDirective,
    DatePipe,
    TranslocoDirective,
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

  protected requestPasswordResetForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\S*$/), Validators.email],
    }),
  });

  protected isOnCooldown = computed<boolean>(() => this.cooldownMs() > 0);

  protected setClickCooldown(): void {
    if (this.cooldownMs() > 0) return;

    this.cooldownMs.set(RequestPasswordResetComponent.cooldownTimeMs);

    timer(1000, 1000)
      .pipe(
        tap(() => this.cooldownMs.update((ms) => ms - 1000)),
        takeWhile(() => this.cooldownMs() > 0),
      )
      .subscribe();
  }

  protected override onSubmit(): void {
    if (this.requestPasswordResetForm.valid) {
      const rawValues = this.requestPasswordResetForm.getRawValue();
      this.authStore.requestPasswordReset({ email: rawValues.email });
      this.showSuccess.set(true);
    } else {
      this.showSuccess.set(false);
      this.requestPasswordResetForm.markAllAsTouched();
    }
  }

  protected onCancel(): void {
    this.router.navigate([this.LOGIN_LINK]);
  }
}
