import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserStore } from '@ombro/admin-user';
import { AppRouteData } from '@ombro/admin-panel/app/core/config/types/routing.types';

export const privilegesGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStore);

  const currentData = route.data as AppRouteData;

  const requiredPrivileges =
    currentData.privilegesRequired ||
    route.pathFromRoot
      .map((r) => (r.data as AppRouteData).privilegesRequired)
      .find((privilegesSet) => privilegesSet instanceof Set && privilegesSet.size > 0);

  if (userStore.hasAppropriatePrivileges(requiredPrivileges)) {
    return true;
  } else {
    return false;
  }
};
