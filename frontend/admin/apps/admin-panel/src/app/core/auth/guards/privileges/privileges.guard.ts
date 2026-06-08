import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthStore } from '../../store';
import { AppRouteData } from '../../../config/types/routing.types';

export const privilegesGuard: CanActivateFn = (route, state) => {
  const store = inject(AuthStore);

  const currentData = route.data as AppRouteData;

  const requiredPrivileges =
    currentData.privilegesRequired ||
    route.pathFromRoot
      .map((r) => (r.data as AppRouteData).privilegesRequired)
      .find((privilegesSet) => privilegesSet instanceof Set && privilegesSet.size > 0);

  if (
    !requiredPrivileges ||
    requiredPrivileges.size === 0 ||
    store.hasAppropriatePrivileges(requiredPrivileges)
  ) {
    return true;
  } else {
    return false;
  }
};
