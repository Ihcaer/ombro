import { AdminPrivileges } from '@ombro/admin-panel/app/core/auth/types/admin-data.types';
import { PANEL_PATHS } from '@ombro/admin-panel/app/features/panel/panel-paths';
import { IconName } from '@ombro/shared/ui/ui-icons';

export type SideMenuItem = Readonly<{
  name: string;
  link: string;
  neededPrivileges: AdminPrivileges;
  isActive?: boolean;
  icon?: IconName;
}>;

export const SIDE_MENU_ITEMS: SideMenuItem[] = [
  {
    name: 'panel.pages.dashboard',
    link: PANEL_PATHS.DASHBOARD,
    neededPrivileges: new Set([]),
    icon: 'home',
  },
] as const;
