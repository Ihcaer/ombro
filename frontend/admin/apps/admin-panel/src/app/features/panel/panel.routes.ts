import { provideTranslocoScope } from '@jsverse/transloco';
import { AppRoutes } from '../../core/config/types/routing.types';
import { PANEL_PATHS } from './panel-paths';

const dashboardPath = PANEL_PATHS.DASHBOARD;

const panelRoutes: AppRoutes = [
  { path: '', redirectTo: dashboardPath, pathMatch: 'full' },
  {
    path: dashboardPath,
    providers: [provideTranslocoScope('panelDashboard')],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
    data: { breadcrumbLabel: 'panel.pages.dashboard', privilegesRequired: new Set([]) },
  },
];

export default panelRoutes;
