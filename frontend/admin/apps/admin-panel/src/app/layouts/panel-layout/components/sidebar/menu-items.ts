import { AdminPrivileges } from '@ombro/admin-panel/app/core/auth/types/admin-data.types';
import { IconName } from '@ombro/shared/ui/ui-icons';

export type SideMenuItem = Readonly<{
  name: string;
  link: string;
  neededPrivileges: AdminPrivileges;
  isActive?: boolean;
  icon?: IconName;
}>;

export const SIDE_MENU_ITEMS: SideMenuItem[] = [] as const;
