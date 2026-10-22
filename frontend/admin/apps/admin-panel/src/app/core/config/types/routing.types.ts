import { Route } from '@angular/router';
import { AdminPrivileges } from '@ombro/admin-user';

export type AppRouteData = { breadcrumbLabel: string; privilegesRequired: AdminPrivileges };

interface AppRoute extends Route {
  data?: AppRouteData;
}

export type AppRoutes = AppRoute[];
