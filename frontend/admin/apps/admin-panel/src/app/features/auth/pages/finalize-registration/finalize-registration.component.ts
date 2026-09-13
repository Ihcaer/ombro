import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { OneTimeTokenStore } from '@ombro/admin-panel/app/shared/data-access/one-time-token';
import { AuthPageBase } from '../auth-page-base';
import { ActivatedRoute } from '@angular/router';
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
import {
  ConfirmAdminAccountFormFieldResponseDto,
  ConfirmAdminAccountFormFieldResponseDtoFieldsItem,
  ConfirmAdminRequestDto,
} from '@ombro/shared/data-access/api-client';
import { translateSignal, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FieldTree, form, FormRoot, FormField, required } from '@angular/forms/signals';

const CONFIRM_PASSWORD_FIELD_NAME = 'confirmPassword' as const;
type RegistrationFormField =
  ConfirmAdminAccountFormFieldResponseDtoFieldsItem | typeof CONFIRM_PASSWORD_FIELD_NAME;
type FinalizeRegistrationForm = Partial<Record<RegistrationFormField, string>>;

@Component({
  selector: 'app-finalize-registration',
  imports: [
    AuthWrapperComponent,
    InputTextComponent,
    FormButtonsComponent,
    ProgressSpinnerModule,
    TranslocoDirective,
    FormRoot,
    FormField,
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
  private readonly transloco = inject(TranslocoService);
  private readonly regexAuthPatterns = inject(REGEX_PATTERNS).auth;

  protected progressSpinnerAriaLabel = signal<string>('Ładowanie');

  private passwordFieldTranslation = translateSignal(
    'common.entities.user.password',
    undefined,
    this.transloco.activeLang(),
  );

  protected neededFormFields: ConfirmAdminAccountFormFieldResponseDto['fields'] = [];

  private passwordStrengthScore = signal<PasswordStrengthScore>(0);

  protected override model: WritableSignal<FinalizeRegistrationForm> = signal({});

  protected override form: FieldTree<FinalizeRegistrationForm, string | number, 'writable'> = form(
    this.model,
    (schemaPath) => {
      for (const field of this.neededFormFields) {
        required(schemaPath[field]!);
      }

      if (this.neededFormFields.includes('handleName')) {
        forbiddenCharsValidator(schemaPath.handleName!, {
          rule: this.regexAuthPatterns.handleName!,
        });
      }
      if (this.neededFormFields.includes('password')) {
        required(schemaPath.confirmPassword!);
        passwordStrengthValidator(schemaPath.password!, {
          passwordScore: this.passwordStrengthScore.asReadonly(),
          minPasswordStrength: this.minPasswordStrength,
        });
        matchFieldsValidator(schemaPath.confirmPassword!, {
          originalField: schemaPath.password!,
          originalFieldName: this.passwordFieldTranslation,
        });
      }
    },
    {
      submission: {
        action: async (field) => {
          if (this.tokenStore.hasToken()) {
            const token = this.tokenStore.oneTimeToken();
            const language = this.transloco.activeLang();

            const { confirmPassword: _, ...formPayload } = field().value();

            this.authStore.finalizeAdminRegistration({
              oneTimeToken: token,
              language,
              ...formPayload,
            } as ConfirmAdminRequestDto);
          }
        },
      },
    },
  );

  ngOnInit(): void {
    this.tokenStore.initializeFromRoute(this.route.snapshot);
    this.getNeededFormFields();
    this.buildFormModel();
  }

  private buildFormModel(): void {
    const model: FinalizeRegistrationForm = {};

    for (const field of this.neededFormFields) {
      model[field] = '';
    }

    if (this.neededFormFields.includes('password')) {
      model[CONFIRM_PASSWORD_FIELD_NAME] = '';
    }

    this.model.set(model);
  }

  protected handlePasswordStrength(score: PasswordStrengthScore): void {
    this.passwordStrengthScore.set(score);
  }

  private getNeededFormFields(): void {
    if (this.tokenStore.hasToken() && this.tokenStore.type() === 'url_magic_link') {
      const token: string = this.tokenStore.oneTimeToken()!;
      this.authStore.checkRegistrationEligibility(token).then((res) => {
        if (res?.fields) {
          const clonedFields = structuredClone(res.fields);
          this.neededFormFields.push(...clonedFields);
        }
      });
    }
  }
}
