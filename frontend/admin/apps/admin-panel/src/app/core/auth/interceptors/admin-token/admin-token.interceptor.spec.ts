import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { adminTokenInterceptor } from './admin-token.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { AuthStore, AuthStoreInstance } from '../../store';
import { Mocked } from 'vitest';
import { API_SCOPE, ApiScope } from '../api-prefix/api-prefix.interceptor';

describe('adminTokenInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;
  let authStore: Mocked<AuthStoreInstance>;

  const tokenSignal = signal<string | null>(null);
  const mockAuthStore = { accessToken: { token: tokenSignal } };

  beforeEach(() => {
    tokenSignal.set(null);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([adminTokenInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthStore, useValue: mockAuthStore },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    authStore = TestBed.inject(AuthStore) as Mocked<AuthStoreInstance>;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  /* it('should add Authorization header when scope is "admin" and token exists', () => {
    const tokenValue = 'test-token';
    tokenSignal.set(tokenValue);
    const mockRequestPath = '/api/admin/users';

    const context = new HttpContext().set(API_SCOPE, 'admin');
    httpClient.get(mockRequestPath, { context }).subscribe();

    const req = httpTesting.expectOne(mockRequestPath);

    expect(req.request.headers.has('Authorization')).toBeTruthy();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${tokenValue}`);
  }); */

  type TestCase = {
    scope: ApiScope | undefined;
    tokenValue: string | null;
    shouldHaveAuthHeader: boolean;
    desc: string;
  };
  const testCases: TestCase[] = [
    {
      scope: 'admin',
      tokenValue: 'test-token',
      shouldHaveAuthHeader: true,
      desc: 'add Authorization header when scope is "admin" and token exists',
    },
    {
      scope: 'admin',
      tokenValue: null,
      shouldHaveAuthHeader: false,
      desc: 'do not add a header when scope is "admin" but no token',
    },
    {
      scope: 'public',
      tokenValue: 'test-token',
      shouldHaveAuthHeader: false,
      desc: 'do not add a header when the scope is other than "admin" (e.g. "public")',
    },
    {
      scope: undefined,
      tokenValue: 'test-token',
      shouldHaveAuthHeader: false,
      desc: 'do not add a header when there is no scope context (undefined)',
    },
  ];

  it.each(testCases)('should $desc', ({ scope, tokenValue, shouldHaveAuthHeader }) => {
    const mockRequestPath = '/api/test';
    tokenSignal.set(tokenValue);

    const options = scope !== undefined ? { context: new HttpContext().set(API_SCOPE, scope) } : {};

    httpClient.get(mockRequestPath, options).subscribe();

    const req = httpTesting.expectOne(mockRequestPath);
    const reqHeaders = req.request.headers;

    expect(reqHeaders.has('Authorization')).toBe(shouldHaveAuthHeader);
    if (shouldHaveAuthHeader) {
      expect(reqHeaders.get('Authorization')).toBe('Bearer ' + tokenValue);
    }
  });
});
