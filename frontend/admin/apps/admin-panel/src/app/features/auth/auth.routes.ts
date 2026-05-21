import { Route } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RequestPasswordResetComponent } from './pages/password-reset/request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './pages/password-reset/reset-password/reset-password.component';
import { FinalizeRegistrationComponent } from './pages/finalize-registration/finalize-registration.component';
import { AUTH_PAGE_PATHS } from './auth-paths';

const authRoutes: Route[] = [
  { path: AUTH_PAGE_PATHS.LOGIN, component: LoginComponent },
  { path: AUTH_PAGE_PATHS.REQUEST_PASSWORD_RESET, component: RequestPasswordResetComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'confirm-registration/:token', component: FinalizeRegistrationComponent },
];

export default authRoutes;
