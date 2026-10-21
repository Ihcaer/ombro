import { Mocked } from 'vitest';
import { AuthStore, AuthStoreInstance } from './auth.store';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import * as jwtDecoder from 'jwt-decode';
import { AuthState } from './auth.state';
import { patchState } from '@ngrx/signals';
import {
  AuthPasswordResetService,
  AuthRegistrationService,
  AuthService,
  LoginResponseDto,
} from '@ombro/shared/data-access/api-client';

vi.mock('jwt-decode', () => ({ jwtDecode: vi.fn() }));

describe('AuthStore', () => {
  let store: AuthStoreInstance;
  let authService: Mocked<AuthService>;
  let authPasswordResetService: Mocked<AuthPasswordResetService>;
  let authRegistrationService: Mocked<AuthRegistrationService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        {
          provide: AuthService,
          useValue: { login: vi.fn(), refreshTokens: vi.fn() },
        },
        {
          provide: AuthPasswordResetService,
          useValue: { requestPasswordReset: vi.fn(), passwordReset: vi.fn() },
        },
        {
          provide: AuthRegistrationService,
          useValue: { getFieldsToConfirmAccount: vi.fn(), confirmAdmin: vi.fn() },
        },
      ],
    });

    store = TestBed.inject(AuthStore) as AuthStoreInstance;
    authService = TestBed.inject(AuthService) as Mocked<AuthService>;
    authPasswordResetService = TestBed.inject(
      AuthPasswordResetService,
    ) as Mocked<AuthPasswordResetService>;
    authRegistrationService = TestBed.inject(
      AuthRegistrationService,
    ) as Mocked<AuthRegistrationService>;
  });

  it('should have initial token value as null', () => {
    expect(store.accessToken().token).toBeNull();
  });

  it('should update token after successful login', () => {
    const mockResponse: LoginResponseDto = {
      accessToken: 'accessToken',
      adminData: {
        id: 1,
        displayName: 'displayName',
        handleName: 'handleName',
        avatarUrl: null,
        privileges: ['ADMINS_MANAGE'],
        verification: 'VERIFIED',
        isActivated: true,
      },
    };
    const mockExpTime = Math.floor(Date.now() / 1000) + 900;

    authService.login.mockReturnValue(of(mockResponse) as Observable<any>);
    vi.mocked(jwtDecoder.jwtDecode).mockReturnValue({ exp: mockExpTime });

    store.login({ identifier: 'handleName', password: 'password' });

    expect(store.accessToken().token).toBe(mockResponse.accessToken);
    expect(store.accessToken().expiresAtMs).toBe(mockExpTime * 1000);
    expect(store.isLoading()).toBe(false);
  });
});
