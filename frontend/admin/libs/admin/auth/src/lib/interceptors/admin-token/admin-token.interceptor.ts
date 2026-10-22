import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../../store';

export const adminTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);

  const token = authStore.accessToken.token();

  let request = req.clone({ withCredentials: true });
  if (token) request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

  return next(request);
};
