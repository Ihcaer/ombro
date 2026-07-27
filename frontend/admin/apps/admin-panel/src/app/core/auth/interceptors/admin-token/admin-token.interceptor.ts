import { HttpInterceptorFn } from '@angular/common/http';
import { API_SCOPE } from '../api-prefix/api-prefix.interceptor';
import { inject } from '@angular/core';
import { AuthStore } from '../../store';

export const adminTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);

  const scope = req.context.get(API_SCOPE);
  const token = authStore.accessToken.token();

  if (scope === 'admin' && token) {
    const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    return next(authReq);
  } else {
    return next(req);
  }
};
