import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AUTH_PATH_SLUG } from './features/auth/auth-paths';
import { PanelLayoutComponent } from './layouts/panel-layout/panel-layout.component';
import { AppRoutes } from './core/config/types/routing.types';

export const appRoutes: AppRoutes = [
  {
    path: AUTH_PATH_SLUG,
    component: AuthLayoutComponent,
    children: [{ path: '', loadChildren: () => import('./features/auth/auth.routes') }],
  },
  {
    path: '',
    component: PanelLayoutComponent,
    children: [{ path: '', loadChildren: () => import('./features/panel/panel.routes') }],
  },
];
