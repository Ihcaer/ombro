import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore, AuthStoreInstance } from '../auth.store';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AUTH_ENDPOINTS } from '../auth.constants';
import { LoginResponse } from '../dto/login.dto';
import { Router } from '@angular/router';
import { LOGIN_PAGE_SLUG } from '../../../features/auth/auth.routes';

const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const token = authStore.accessToken().token;
  const excludedUrls = [AUTH_ENDPOINTS.LOGIN, AUTH_ENDPOINTS.REFRESH_TOKEN];
  const isExcluded = excludedUrls.some((url) => req.url.includes(url));

  let authReq = token ? addTokenHeader(req, token) : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !isExcluded) {
        return handle401Error(authReq, next, authStore, router);
      }
      return throwError(() => error);
    }),
  );
};

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  store: AuthStoreInstance,
  router: Router,
): Observable<HttpEvent<unknown>> {
  if (!store.isLoading()) {
    refreshTokenSubject.next(null);

    return store.refreshTokens().pipe(
      switchMap((res: LoginResponse) => {
        const newToken = res.jwt;
        refreshTokenSubject.next(newToken);
        return next(addTokenHeader(request, newToken));
      }),
      catchError((error: unknown) => {
        const loginPageUrl = `/${LOGIN_PAGE_SLUG}`;
        router.navigate([loginPageUrl]);
        return throwError(() => error);
      }),
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((newToken) => next(addTokenHeader(request, newToken))),
    );
  }
}

function addTokenHeader(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}
