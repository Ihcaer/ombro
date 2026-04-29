import { Route } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [{ path: '', loadChildren: () => import('./features/auth/auth.routes') }],
  },
  // { path: '' },
];
