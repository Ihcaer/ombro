import { TestBed } from '@angular/core/testing';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import { authInterceptor } from './auth.interceptor';
import { signal, WritableSignal } from '@angular/core';
import { RxMethod } from '@ngrx/signals/rxjs-interop';
import { Router } from '@angular/router';
import { firstValueFrom, of, throwError } from 'rxjs';
import { AuthStoreInstance, AuthStore } from '../store';
import { LoginRequestDto, LoginResponseDto } from '../dto/login.dtos';
import { AUTH_PAGE_PATHS } from '@ombro/admin-panel/app/features/auth/auth-paths';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  let authStore: AuthStoreInstance;
  let router: Router;
  const loginSlug = AUTH_PAGE_PATHS.LOGIN;

  beforeEach(() => {
    const authStoreMock: Partial<AuthStoreInstance> = {
      admin: signal(null),
      accessToken: Object.assign(signal({ token: null, expiresAtMs: null }), {
        token: signal<string | null>(null),
        expiresAtMs: signal<number | null>(null),
      }),
      isLoading: signal(false),
      lastErrorResponse: signal(null),
      login: vi.fn() as unknown as RxMethod<LoginRequestDto>,
      refreshTokens: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: authStoreMock },
        { provide: Router, useValue: { navigate: vi.fn().mockResolvedValue(true) } },
      ],
    });

    authStore = TestBed.inject(AuthStore);
    router = TestBed.inject(Router);
  });

  it('should add Authorization header if token exists', async () => {
    const mockTokenState = {
      token: 'testToken',
      expiresAtMs: Date.now() + 900000,
    };

    const req = new HttpRequest('GET', '/api/v1/user');
    let capturedRequest: HttpRequest<unknown> | undefined;

    const nextMock: HttpHandlerFn = vi.fn((modifiedReq) => {
      capturedRequest = modifiedReq;
      return of(new HttpResponse({ status: 200 }));
    });

    const tokenSignal = authStore.accessToken as unknown as WritableSignal<typeof mockTokenState>;
    const subTokenSignal = authStore.accessToken.token as unknown as WritableSignal<string | null>;
    const subExpiresSignal = authStore.accessToken.expiresAtMs as unknown as WritableSignal<
      number | null
    >;

    // 3. Ustawienie wartości
    tokenSignal.set(mockTokenState);
    subTokenSignal.set(mockTokenState.token);
    subExpiresSignal.set(mockTokenState.expiresAtMs);
    // tokenSignal.set(mockTokenState);

    await firstValueFrom(interceptor(req, nextMock));

    expect(nextMock).toHaveBeenCalled();
    expect(capturedRequest?.headers.get('Authorization')).toBe(`Bearer ${mockTokenState.token}`);
  });

  it.each([
    {
      endpoint: '/api/v1/new-post',
      authorized: true,
      expectedCallCount: 2,
      desc: 'missing/outdated access token',
    },
    {
      endpoint: `/api/v1/${loginSlug}`,
      authorized: true,
      expectedCallCount: 1,
      desc: 'ignored path',
    },
    {
      endpoint: '/api/v1/new-post',
      authorized: false,
      expectedCallCount: 1,
      desc: 'unauthorized refresh token',
    },
  ])(
    'should send $expectedCallCount requests for scenario: $desc',
    async ({ endpoint, authorized, expectedCallCount }) => {
      const mockRefreshTokenResponse: LoginResponseDto = {
        jwt: 'accessToken',
        adminData: {
          id: 1,
          displayName: 'displayName',
          handleName: 'handleName',
          avatarId: null,
          privileges: ['ADMINS_MANAGE'],
          verification: 'VERIFIED',
          isActivated: true,
        },
      };

      const req = new HttpRequest('POST', endpoint, null);
      let callCount = 0;
      let capturedRequest: HttpRequest<unknown>[] = [];

      const nextMock: HttpHandlerFn = vi.fn((modifiedReq) => {
        ++callCount;
        capturedRequest.push(modifiedReq);

        if (callCount === 1)
          return throwError(
            () => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }),
          );

        return of(new HttpResponse({ status: 200, body: { data: 'success' } }));
      });

      vi.mocked(authStore.refreshTokens).mockReturnValue(
        authorized
          ? of(mockRefreshTokenResponse)
          : throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })),
      );

      try {
        await firstValueFrom(interceptor(req, nextMock));
      } catch (err) {}

      expect(nextMock).toHaveBeenCalled();
      expect(callCount).toBe(expectedCallCount);
      if (endpoint.includes(loginSlug)) {
        expect(authStore.refreshTokens).not.toHaveBeenCalled();
      } else {
        expect(authStore.refreshTokens).toHaveBeenCalled();
      }
    },
  );
});
