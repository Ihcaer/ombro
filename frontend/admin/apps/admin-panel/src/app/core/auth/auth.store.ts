import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Admin } from './types/admin-data.types';
import { AuthService } from './auth.service';
import { computed, effect, inject } from '@angular/core';
import { LoginRequest, LoginResponse } from './dto/login.dto';
import { catchError, EMPTY, Observable, pipe, switchMap, tap, throwError, timer } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AccessTokenPayload } from './types/jwt.types';
import { jwtDecode } from 'jwt-decode';

type AuthState = {
  admin: Admin | null;
  accessToken: { token: string | null; expiresAtMs: number | null };
  isLoading: boolean;
  lastError: HttpErrorResponse | null;
};

const initialState: Readonly<AuthState> = {
  admin: null,
  accessToken: { token: null, expiresAtMs: null },
  isLoading: false,
  lastError: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(() => initialState),
  withMethods((store) => ({
    _updateAuthState(response: LoginResponse): void {
      patchState(store, {
        admin: response.adminData,
        accessToken: {
          token: response.jwt,
          expiresAtMs: getAccessTokenExpirationTimeMs(response.jwt),
        },
        isLoading: false,
        lastError: null,
      });
    },
    _resetAuthState(): void {
      patchState(store, structuredClone(initialState));
    },
    _setLoading(): void {
      patchState(store, { isLoading: true });
    },
    _cancelLoading(): void {
      patchState(store, { isLoading: false });
    },
    _setError(err: HttpErrorResponse): void {
      patchState(store, { isLoading: false, lastError: err });
    },
  })),
  withMethods((store, authService = inject(AuthService)) => ({
    login: rxMethod<LoginRequest>(
      pipe(
        tap(() => store._setLoading()),
        switchMap((credentials) =>
          authService.login(credentials).pipe(
            tapResponse({
              next: (res) => {
                store._updateAuthState(res);
                console.log('Login successful');
                // add routing to panel and delete console.log
              },
              error: (error: HttpErrorResponse) => {
                store._setError(error);
              },
            }),
          ),
        ),
      ),
    ),
    refreshTokens(): Observable<LoginResponse> {
      if (store.isLoading()) return EMPTY;

      store._setLoading();

      return authService.refreshToken().pipe(
        tap((res) => {
          store._updateAuthState(res);
        }),
        catchError((error: unknown) => {
          store._resetAuthState();
          return throwError(() => error);
        }),
      );
    },
  })),
  withMethods((store) => ({
    initAutoRefresh() {
      effect((onCleanup) => {
        const tokenExpirationMs = store.accessToken.expiresAtMs();
        if (!tokenExpirationMs) return;

        const expirationDate = new Date(tokenExpirationMs - 30000);

        const refresh$ = timer(expirationDate)
          .pipe(
            switchMap(() => store.refreshTokens()),
            catchError(() => EMPTY),
          )
          .subscribe();

        onCleanup(() => refresh$.unsubscribe());
      });
    },
  })),
  withComputed(({ accessToken }) => ({
    isAccessTokenExpired: computed((): boolean => {
      const expiry = accessToken().expiresAtMs;
      return expiry ? Date.now() > expiry : true;
    }),
  })),
  withHooks({
    onInit(store) {
      store.initAutoRefresh();
    },
  }),
);

export type AuthStoreInstance = InstanceType<typeof AuthStore>;

const getAccessTokenExpirationTimeMs = (token: string): number =>
  jwtDecode<AccessTokenPayload>(token).exp * 1000;
