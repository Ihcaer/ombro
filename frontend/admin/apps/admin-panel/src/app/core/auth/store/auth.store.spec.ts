import { Mocked } from 'vitest';
import { AuthStore, AuthStoreInstance } from './auth.store';
import { AuthService } from '../auth.service';
import { TestBed } from '@angular/core/testing';
import { LoginResponseDto } from '../dto/login.dto';
import { of } from 'rxjs';
import * as jwtDecoder from 'jwt-decode';

vi.mock('jwt-decode', () => ({ jwtDecode: vi.fn() }));

describe('AuthStore', () => {
  let store: AuthStoreInstance;
  let authService: Mocked<AuthService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        { provide: AuthService, useValue: { login: vi.fn(), refreshToken: vi.fn() } },
      ],
    });

    store = TestBed.inject(AuthStore);
    authService = TestBed.inject(AuthService) as Mocked<AuthService>;
  });

  it('should update status after successful login', () => {
    const mockResponse: LoginResponseDto = {
      jwt: 'accessToken',
      adminData: {
        id: 1,
        displayName: 'displayName',
        handleName: 'handleName',
        avatarId: null,
        privileges: 1,
        verification: 'VERIFIED',
        isActivated: true,
      },
    };
    const mockExpTime = Math.floor(Date.now() / 1000) + 900;

    authService.login.mockReturnValue(of(mockResponse));
    vi.mocked(jwtDecoder.jwtDecode).mockReturnValue({ options: { expiresIn: mockExpTime } });

    store.login({ identifier: 'handleName', password: 'password' });

    expect(store.admin()).toEqual(mockResponse.adminData);
    expect(store.accessToken.token()).toBe(mockResponse.jwt);
    expect(store.isLoading()).toBe(false);
  });
});
