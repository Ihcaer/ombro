import { Route } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

export const LOGIN_PAGE_SLUG = 'login' as const;

const authRoutes: Route[] = [{ path: LOGIN_PAGE_SLUG, component: LoginComponent }];

export default authRoutes;
