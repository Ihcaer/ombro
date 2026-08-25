import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AuthWrapperComponent } from '../../components/auth-wrapper/auth-wrapper.component';
import { FormButtonsComponent } from '../../components/form-buttons/form-buttons.component';
import { InputTextComponent } from '@ombro/shared/ui/ui-forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { Router, RouterLink } from '@angular/router';
import { AUTH_PAGE_PATHS, AUTH_PATH_SLUG } from '../../auth-paths';
import { AuthPageBase } from '../auth-page-base';
import { TranslocoDirective } from '@jsverse/transloco';

type LoginForm = { login: FormControl<string>; password: FormControl<string> };

@Component({
  selector: 'app-login',
  imports: [
    AuthWrapperComponent,
    FormButtonsComponent,
    InputTextComponent,
    ReactiveFormsModule,
    MessageModule,
    RouterLink,
    TranslocoDirective,
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

  protected loginForm = new FormGroup<LoginForm>({
    login: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\S*$/)],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    if (this.authStore.isAdminLoggedIn()) this.router.navigateByUrl('/');
  }

  protected override onSubmit(): void {
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
