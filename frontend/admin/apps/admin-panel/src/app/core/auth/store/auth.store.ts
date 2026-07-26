import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
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
  timer,
} from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthStateInternalError, initialState } from './auth.state';
import { getAccessTokenExpirationTimeMs, loginPagePath } from './common';
import {
  RequestPasswordResetRequestDto,
  ResetPasswordRequestDto,
} from '../dto/reset-password.dtos';
import { isActive, NavigationEnd, Router } from '@angular/router';
import {
  FinalizeAdminRegistrationRequestDto,
  RegistrationEligibilityRequestDto,
  RegistrationEligibilityResponseDto,
} from '../dto/admin-register.dtos';
import { AdminPrivileges } from '../types/admin-data.types';
import { PANEL_PATHS } from '@ombro/admin-panel/app/features/panel/panel-paths';
import { AUTH_PAGE_PATHS, AUTH_PATH_SLUG } from '@ombro/admin-panel/app/features/auth/auth-paths';

const getInitialState = () => structuredClone(initialState);

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(getInitialState),
  withProps(() => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const authPath = '/' + AUTH_PATH_SLUG;
    const loginPath = `${authPath}/${AUTH_PAGE_PATHS.LOGIN}`;
    const isAuthPage = isActive(authPath, router, {
      paths: 'subset',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored',
    });
    const isLoginPage = isActive(loginPath, router, {
      paths: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored',
    });

    return { authService, router, isAuthPage, isLoginPage };
  }),
  withMethods((store) => ({
    _updateAuthState(response: LoginResponseDto): void {
      patchState(store, {
        admin: { ...response.adminData, privileges: new Set(response.adminData.privileges) },
        accessToken: {
          token: response.accessToken,
          expiresAtMs: getAccessTokenExpirationTimeMs(response.accessToken),
        },
        isLoading: false,
        lastResponseError: null,
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
    _setResponseError(err: HttpErrorResponse): void {
      patchState(store, { isLoading: false, lastResponseError: err });
    },
    _clearResponseError(): void {
      patchState(store, { lastResponseError: null });
    },
    _startRequest(): void {
      patchState(store, { isLoading: true, lastResponseError: null });
    },
    _setInternalError(type: AuthStateInternalError): void {
      patchState(store, { lastInternalError: type });
    },
    clearInternalError(): void {
      patchState(store, { lastInternalError: null });
    },
  })),
  withMethods(
    ({
      authService,
      router,
      isLoading,
      admin,
      _startRequest,
      _updateAuthState,
      _setResponseError,
      _resetAuthState,
      _setInternalError,
      _cancelLoading,
    }) => ({
      login: rxMethod<LoginRequestDto>(
        pipe(
          tap(() => _startRequest()),
          exhaustMap((credentials) =>
            authService.login(credentials).pipe(
              tapResponse({
                next: (res) => {
                  _updateAuthState(res);
                  router.navigateByUrl('/' + PANEL_PATHS.DASHBOARD);
                },
                error: (err: HttpErrorResponse) => _setResponseError(err),
              }),
            ),
          ),
        ),
      ),
      refreshTokens(): Observable<LoginResponseDto> {
        if (isLoading()) return EMPTY;

        _startRequest();

        return authService.refreshToken().pipe(
          tapResponse({
            next: (res) => _updateAuthState(res),
            error: (error) => {
              _resetAuthState();
              _setInternalError('SESSION_REFRESH_FAILED');
            },
          }),
        );
      },
      logout: rxMethod<void>(
        pipe(
          tap(() => _startRequest()),
          exhaustMap(() =>
            authService.logout().pipe(
              tapResponse({
                next: () => {
                  _resetAuthState;
                  router.navigateByUrl(loginPagePath);
                },
                error: () => {
                  _resetAuthState;
                  router.navigateByUrl(loginPagePath);
                },
              }),
            ),
          ),
        ),
      ),
      // Reset password methods
      requestPasswordReset: rxMethod<RequestPasswordResetRequestDto>(
        pipe(
          tap(() => _startRequest()),
          exhaustMap((data) =>
            authService.requestPasswordReset(data).pipe(
              tapResponse({
                next: () => _cancelLoading(),
                error: (err: HttpErrorResponse) => _setResponseError(err),
              }),
            ),
          ),
        ),
      ),
      resetPassword: rxMethod<ResetPasswordRequestDto>(
        pipe(
          tap(() => _startRequest()),
          exhaustMap((data) =>
            authService.resetPassword(data).pipe(
              tapResponse({
                next: () => _cancelLoading(),
                error: (err: HttpErrorResponse) => _setResponseError(err),
              }),
            ),
          ),
        ),
      ),
      // Finalize registration methods
      async checkRegistrationEligibility(
        payload: RegistrationEligibilityRequestDto,
      ): Promise<RegistrationEligibilityResponseDto | undefined> {
        _startRequest();

        try {
          return await firstValueFrom(authService.checkRegistrationEligibility(payload));
        } catch (error: unknown) {
          if (error instanceof HttpErrorResponse) _setResponseError(error);
          return;
        }
      },
      finalizeAdminRegistration: rxMethod<FinalizeAdminRegistrationRequestDto>(
        pipe(
          tap(() => _startRequest()),
          exhaustMap((payload) =>
            authService.finalizeAdminRegistration(payload).pipe(
              tapResponse({
                next: () => _cancelLoading(),
                error: (err: HttpErrorResponse) => _setResponseError(err),
              }),
            ),
          ),
        ),
      ),
      // Privileges methods
      hasAppropriatePrivileges(neededPrivileges: AdminPrivileges): boolean {
        if (!admin() || !admin()?.privileges || neededPrivileges === undefined) return false;
        if (neededPrivileges.size === 0) return true;

        const adminPrivileges: AdminPrivileges = admin()!.privileges;

        if (neededPrivileges.size > adminPrivileges.size) return false;
        return [...neededPrivileges].every((privilege) => adminPrivileges.has(privilege));
      },
    }),
  ),
  withMethods(({ router, refreshTokens, _clearResponseError, clearInternalError }) => ({
    _processAutoRefresh: rxMethod<number | null>(
      pipe(
        switchMap((expiresAtMs) => {
          if (!expiresAtMs) return EMPTY;

          const refreshTime = expiresAtMs - 30000;
          const delay = refreshTime - Date.now();

          return timer(Math.max(0, delay)).pipe(
            switchMap(() => refreshTokens()),
            catchError(() => EMPTY),
          );
        }),
      ),
    ),
    _clearErrorsOnNavigating: rxMethod<void>((trigger$) =>
      trigger$.pipe(
        switchMap(() => router.events),
        filter((event) => event instanceof NavigationEnd),
        tap(() => {
          _clearResponseError();
          clearInternalError();
        }),
      ),
    ),
  })),
  withComputed(({ accessToken, isAuthPage, isLoginPage }) => ({
    isAccessTokenExpired: computed<boolean>(() => {
      const expiry = accessToken.expiresAtMs();
      return expiry ? Date.now() > expiry : true;
    }),
    isAdminLoggedIn: computed<boolean>(() => {
      const token = accessToken.token();
      return !!token;
    }),
    _isAuthPathExceptLogin: computed<boolean>(() => isAuthPage() && !isLoginPage()),
  })),
  withHooks({
    onInit({
      admin,
      accessToken,
      refreshTokens,
      _processAutoRefresh,
      _clearErrorsOnNavigating: _clearResponseErrorWhenNavigating,
      _isAuthPathExceptLogin,
    }) {
      queueMicrotask(() => {
        if (!admin() && !_isAuthPathExceptLogin())
          firstValueFrom(refreshTokens(), { defaultValue: null });
      });
      _processAutoRefresh(accessToken.expiresAtMs);
      _clearResponseErrorWhenNavigating();
    },
  }),
);

export type AuthStoreInstance = InstanceType<typeof AuthStore>;
