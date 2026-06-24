import { AppRoutes } from '../../core/config/types/routing.types';
import { PANEL_PATHS } from './panel-paths';

const dashboardPath = PANEL_PATHS.DASHBOARD;

const panelRoutes: AppRoutes = [
  { path: '', redirectTo: dashboardPath, pathMatch: 'full' },
  {
    path: dashboardPath,
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
    data: { breadcrumbLabel: 'Dashboard', privilegesRequired: new Set([]) },
  },
];

export default panelRoutes;
