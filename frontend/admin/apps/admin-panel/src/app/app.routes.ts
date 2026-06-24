import { AUTH_PATH_SLUG } from './features/auth/auth-paths';
import { AppRoutes } from './core/config/types/routing.types';

export const appRoutes: AppRoutes = [
  {
    path: AUTH_PATH_SLUG,
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [{ path: '', loadChildren: () => import('./features/auth/auth.routes') }],
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/panel-layout/panel-layout.component').then((m) => m.PanelLayoutComponent),
    children: [{ path: '', loadChildren: () => import('./features/panel/panel.routes') }],
  },
];
