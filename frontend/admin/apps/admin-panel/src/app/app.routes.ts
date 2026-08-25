import { AUTH_PATH_SLUG } from './features/auth/auth-paths';
import { AppRoutes } from './core/config/types/routing.types';
import { provideTranslocoScope } from '@jsverse/transloco';

export const appRoutes: AppRoutes = [
  {
    path: AUTH_PATH_SLUG,
    providers: [provideTranslocoScope('auth')],
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [{ path: '', loadChildren: () => import('./features/auth/auth.routes') }],
  },
  {
    path: '',
    providers: [provideTranslocoScope('panel')],
    loadComponent: () =>
      import('./layouts/panel-layout/panel-layout.component').then((m) => m.PanelLayoutComponent),
    children: [{ path: '', loadChildren: () => import('./features/panel/panel.routes') }],
  },
];
