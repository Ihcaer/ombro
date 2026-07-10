import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { OneTimeTokenStore } from '@ombro/admin-panel/app/shared/data-access/one-time-token';
import { AuthPageBase } from '../auth-page-base';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  FinalizeAdminRegistrationRequestDto,
  RegistrationEligibilityResponseDto,
} from '@ombro/admin-panel/app/core/auth/dto/admin-register.dtos';
import { PASSWORD_STRENGTH_THRESHOLD } from '@ombro/admin-panel/app/core/tokens/security.tokens';
import { PasswordStrengthScore } from '@ombro/shared/utils/password-strength';
import {
  forbiddenCharsValidator,
  InputTextComponent,
  matchFieldsValidator,
  passwordStrengthValidator,
} from '@ombro/shared/ui/ui-forms';
import { AuthWrapperComponent } from '../../components/auth-wrapper/auth-wrapper.component';
import { FormButtonsComponent } from '../../components/form-buttons/form-buttons.component';
import { REGEX_PATTERNS } from '@ombro/admin-panel/app/shared/tokens/pattern.tokens';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-finalize-registration',
  imports: [
    AuthWrapperComponent,
    ReactiveFormsModule,
    InputTextComponent,
    FormButtonsComponent,
    ProgressSpinnerModule,
  ],
  providers: [OneTimeTokenStore],
  templateUrl: './finalize-registration.component.html',
  styles: `
    @use '../../styles/common.scss';
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalizeRegistrationComponent extends AuthPageBase implements OnInit {
  protected readonly minPasswordStrength = inject(PASSWORD_STRENGTH_THRESHOLD);
  private readonly tokenStore = inject(OneTimeTokenStore);
  private readonly route = inject(ActivatedRoute);
  private readonly regexAuthPatterns = inject(REGEX_PATTERNS).auth;

  protected progressSpinnerAriaLabel = signal<string>('Ładowanie');

  protected registrationForm = new FormGroup({});
  protected neededFormFields: RegistrationEligibilityResponseDto = [];
  protected readonly CONFIRM_PASSWORD_FIELD_NAME = 'confirmPassword';

  private passwordStrengthScore: PasswordStrengthScore = 0;

  ngOnInit(): void {
    this.tokenStore.initializeFromRoute(this.route.snapshot);
    this.getNeededFormFields();
    this.buildForm();
  }

  protected override onSubmit(): void {
    if (this.registrationForm.valid && this.tokenStore.hasToken()) {
      const token = this.tokenStore.oneTimeToken();

      const formValue = this.registrationForm.value as Record<string, any>;
      const { [this.CONFIRM_PASSWORD_FIELD_NAME]: _, ...formPayload } = formValue;

      this.authStore.finalizeAdminRegistration({
        oneTimeToken: token,
        ...formPayload,
      } as FinalizeAdminRegistrationRequestDto);
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  protected handlePasswordStrength(score: PasswordStrengthScore): void {
    this.passwordStrengthScore = score;
    this.registrationForm.get('password')?.updateValueAndValidity();
  }

  private getNeededFormFields(): void {
    if (this.tokenStore.hasToken() && this.tokenStore.type() === 'url_magic_link') {
      const token: string = this.tokenStore.oneTimeToken()!;
      this.authStore.checkRegistrationEligibility(token).then((res) => {
        this.neededFormFields.push(...res!);
      });
    }
  }

  private buildForm(): void {
    this.neededFormFields.forEach((field) => {
      switch (field) {
        case 'handleName': {
          this.registrationForm.addControl(
            field,
            new FormControl('', {
              nonNullable: true,
              validators: [
                Validators.required,
                forbiddenCharsValidator(this.regexAuthPatterns.handleName!),
              ],
            }),
          );
          break;
        }
        case 'password': {
          this.registrationForm.addControl(
            field,
            new FormControl('', {
              nonNullable: true,
              validators: [
                Validators.required,
                passwordStrengthValidator(
                  () => this.passwordStrengthScore,
                  this.minPasswordStrength,
                ),
              ],
            }),
          );
          this.registrationForm.addControl(
            this.CONFIRM_PASSWORD_FIELD_NAME,
            new FormControl('', { nonNullable: true, validators: [Validators.required] }),
          );
          break;
        }
        default:
          this.registrationForm.addControl(
            field,
            new FormControl('', { nonNullable: true, validators: [Validators.required] }),
          );
      }

      if (this.neededFormFields.includes('password')) {
        this.registrationForm.addValidators(
          matchFieldsValidator(['newPassword', 'confirmNewPassword']),
        );
      }
    });
  }
}
