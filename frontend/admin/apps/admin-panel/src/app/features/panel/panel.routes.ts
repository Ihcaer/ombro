import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutes } from '../../core/config/types/routing.types';

const panelRoutes: AppRoutes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
];

export default panelRoutes;
