import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { AUTH_ENDPOINTS, AUTH_ROUTE_PREFIX } from '../../auth.constants';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(AuthStore);
  const router = inject(Router);

  if (store.accessToken().token && !store.isAccessTokenExpired()) {
    return true;
  } else {
    return router.parseUrl(AUTH_ROUTE_PREFIX + AUTH_ENDPOINTS.LOGIN);
  }
};
