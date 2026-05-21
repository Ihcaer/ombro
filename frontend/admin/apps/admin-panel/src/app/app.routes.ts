import { Route } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AUTH_PATH_SLUG } from './features/auth/auth-paths';

export const appRoutes: Route[] = [
  {
    path: AUTH_PATH_SLUG,
    component: AuthLayoutComponent,
    children: [{ path: '', loadChildren: () => import('./features/auth/auth.routes') }],
  },
  // { path: '' },
];
