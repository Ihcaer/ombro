import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { AuthWrapperComponent } from '../../components/auth-wrapper/auth-wrapper.component';
import { FormButtonsComponent } from '../../components/form-buttons/form-buttons.component';
import { FORM_ERRORS, InputTextComponent } from '@ombro/shared/ui/ui-forms';
import { MessageModule } from 'primeng/message';
import { Router, RouterLink } from '@angular/router';
import { AUTH_PAGE_PATHS, AUTH_PATH_SLUG } from '../../auth-paths';
import { AuthPageBase } from '../auth-page-base';
import { TranslocoDirective } from '@jsverse/transloco';
import { FieldTree, form, FormField, FormRoot, pattern, required } from '@angular/forms/signals';
import { translationMessage } from '@ombro/shared/utils/translation-utils';

type LoginForm = { login: string; password: string };

@Component({
  selector: 'app-login',
  imports: [
    AuthWrapperComponent,
    FormButtonsComponent,
    InputTextComponent,
    MessageModule,
    RouterLink,
    TranslocoDirective,
    FormField,
    FormRoot,
  ],
  templateUrl: './login.component.html',
  styles: `
    @use '../../styles/common.scss';
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends AuthPageBase implements OnInit {
  private readonly router = inject(Router);

  protected readonly passwordResetLink = `/${AUTH_PATH_SLUG}/${AUTH_PAGE_PATHS.REQUEST_PASSWORD_RESET}`;

  protected override model: WritableSignal<LoginForm> = signal({
    login: '',
    password: '',
  });

  protected override form: FieldTree<LoginForm, string | number, 'writable'> = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.login, {
        message: this.requiredErrorMessage,
      });
      pattern(schemaPath.login, /^\S*$/, { message: translationMessage(FORM_ERRORS.pattern.key) });
      required(schemaPath.password, {
        message: this.requiredErrorMessage,
      });
    },
    {
      submission: {
        action: async (field) => {
          const value = field().value();
          this.authStore.login({ identifier: value.login, password: value.password });
        },
      },
    },
  );

  ngOnInit(): void {
    if (this.authStore.isAdminLoggedIn()) this.router.navigateByUrl('/');
  }
}
