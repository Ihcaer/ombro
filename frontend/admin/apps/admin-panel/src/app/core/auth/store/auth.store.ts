import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { AuthService } from '../auth.service';
import { computed, inject } from '@angular/core';
import { LoginRequestDto, LoginResponseDto } from '../dto/login.dtos';
import {
  catchError,
  EMPTY,
  exhaustMap,
  filter,
  firstValueFrom,
  Observable,
  pipe,
  switchMap,
  tap,
  throwError,
  timer,
} from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { initialState } from './auth.state';
import { getAccessTokenExpirationTimeMs } from './functions';
import {
  RequestPasswordResetRequestDto,
  ResetPasswordRequestDto,
} from '../dto/reset-password.dtos';
import { NavigationEnd, Router } from '@angular/router';
import {
  FinalizeAdminRegistrationRequestDto,
  RegistrationEligibilityRequestDto,
  RegistrationEligibilityResponseDto,
} from '../dto/admin-register.dtos';
import { AdminPrivileges } from '../types/admin-data.types';

const getInitialState = () => structuredClone(initialState);

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(getInitialState),
  withMethods((store) => ({
    _updateAuthState(response: LoginResponseDto): void {
      patchState(store, {
        admin: { ...response.adminData, privileges: new Set(response.adminData.privileges) },
        accessToken: {
          token: response.jwt,
          expiresAtMs: getAccessTokenExpirationTimeMs(response.jwt),
        },
        isLoading: false,
        lastErrorResponse: null,
      });
    },
    _resetAuthState(): void {
      patchState(store, getInitialState);
    },
    _setLoading(): void {
      patchState(store, { isLoading: true });
    },
    _cancelLoading(): void {
      patchState(store, { isLoading: false });
    },
    _setError(err: HttpErrorResponse): void {
      patchState(store, { isLoading: false, lastErrorResponse: err });
    },
    _clearError(): void {
      patchState(store, { lastErrorResponse: null });
    },
    _startRequest(): void {
      patchState(store, { isLoading: false, lastErrorResponse: null });
    },
  })),
  withMethods((store, authService = inject(AuthService)) => ({
    login: rxMethod<LoginRequestDto>(
      pipe(
        tap(() => store._startRequest()),
        exhaustMap((credentials) =>
          authService.login(credentials).pipe(
            tapResponse({
              next: (res) => {
                store._updateAuthState(res);
                console.log('Login successful');
                // add routing to panel and delete console.log
              },
              error: (err: HttpErrorResponse) => store._setError(err),
            }),
          ),
        ),
      ),
    ),
    refreshTokens(): Observable<LoginResponseDto> {
      if (store.isLoading()) return EMPTY;

      store._startRequest();

      return authService.refreshToken().pipe(
        tap((res) => store._updateAuthState(res)),
        catchError((error: unknown) => {
          store._resetAuthState();
          return throwError(() => error);
        }),
      );
    },
    // Reset password methods
    requestPasswordReset: rxMethod<RequestPasswordResetRequestDto>(
      pipe(
        tap(() => store._startRequest()),
        exhaustMap((data) =>
          authService.requestPasswordReset(data).pipe(
            tapResponse({
              next: () => store._cancelLoading(),
              error: (err: HttpErrorResponse) => store._setError(err),
            }),
          ),
        ),
      ),
    ),
    resetPassword: rxMethod<ResetPasswordRequestDto>(
      pipe(
        tap(() => store._startRequest()),
        exhaustMap((data) =>
          authService.resetPassword(data).pipe(
            tapResponse({
              next: () => store._cancelLoading(),
              error: (err: HttpErrorResponse) => store._setError(err),
            }),
          ),
        ),
      ),
    ),
    // Finalize registration methods
    async checkRegistrationEligibility(
      payload: RegistrationEligibilityRequestDto,
    ): Promise<RegistrationEligibilityResponseDto | undefined> {
      store._startRequest();

      try {
        return await firstValueFrom(authService.checkRegistrationEligibility(payload));
      } catch (error: unknown) {
        if (error instanceof HttpErrorResponse) store._setError(error);
        return;
      }
    },
    finalizeAdminRegistration: rxMethod<FinalizeAdminRegistrationRequestDto>(
      pipe(
        tap(() => store._startRequest()),
        exhaustMap((payload) =>
          authService.finalizeAdminRegistration(payload).pipe(
            tapResponse({
              next: () => store._cancelLoading(),
              error: (err: HttpErrorResponse) => store._setError(err),
            }),
          ),
        ),
      ),
    ),
    // Privileges methods
    hasAppropriatePrivileges(neededPrivileges: AdminPrivileges): boolean {
      if (!store.admin() || !store.admin()?.privileges || neededPrivileges === undefined)
        return false;
      if (neededPrivileges.size === 0) return true;

      const adminPrivileges: AdminPrivileges = store.admin()!.privileges;

      if (neededPrivileges.size > adminPrivileges.size) return false;
      return [...neededPrivileges].every((privilege) => adminPrivileges.has(privilege));
    },
  })),
  withMethods((store, router = inject(Router)) => ({
    _processAutoRefresh: rxMethod<number | null>(
      pipe(
        switchMap((expiresAtMs) => {
          if (!expiresAtMs) return EMPTY;

          const refreshTime = expiresAtMs - 30000;
          const delay = refreshTime - Date.now();

          return timer(Math.max(0, delay)).pipe(
            switchMap(() => store.refreshTokens()),
            catchError(() => EMPTY),
          );
        }),
      ),
    ),
    _clearResponseErrorWhenNavigating: rxMethod<void>((trigger$) =>
      trigger$.pipe(
        switchMap(() => router.events),
        filter((event) => event instanceof NavigationEnd),
        tap(() => store._clearError()),
      ),
    ),
  })),
  withComputed(({ accessToken }) => ({
    isAccessTokenExpired: computed((): boolean => {
      const expiry = accessToken.expiresAtMs();
      return expiry ? Date.now() > expiry : true;
    }),
  })),
  withHooks({
    onInit(store) {
      store._processAutoRefresh(store.accessToken.expiresAtMs);
      store._clearResponseErrorWhenNavigating();
    },
  }),
);

export type AuthStoreInstance = InstanceType<typeof AuthStore>;
