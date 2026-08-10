import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { adminTokenInterceptor } from './admin-token.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { AuthStore, AuthStoreInstance } from '../../store';
import { Mocked } from 'vitest';

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

  it('should add Authorization header when token exists', () => {
    const tokenValue = 'test-token';
    tokenSignal.set(tokenValue);
    const mockRequestPath = '/api/admin/users';

    httpClient.get(mockRequestPath).subscribe();

    const req = httpTesting.expectOne(mockRequestPath);

    expect(req.request.headers.has('Authorization')).toBeTruthy();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${tokenValue}`);
  });
});
