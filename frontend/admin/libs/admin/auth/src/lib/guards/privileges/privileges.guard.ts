import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AdminUserStore } from '@ombro/admin-user';
import { AppRouteData } from '@ombro/admin-panel/app/core/config/types/routing.types';

export const privilegesGuard: CanActivateFn = (route, state) => {
  const adminUserStore = inject(AdminUserStore);

  const currentData = route.data as AppRouteData;

  const requiredPrivileges =
    currentData.privilegesRequired ||
    route.pathFromRoot
      .map((r) => (r.data as AppRouteData).privilegesRequired)
      .find((privilegesSet) => privilegesSet instanceof Set && privilegesSet.size > 0);

  if (adminUserStore.hasAppropriatePrivileges(requiredPrivileges)) {
    return true;
  } else {
    return false;
  }
};
