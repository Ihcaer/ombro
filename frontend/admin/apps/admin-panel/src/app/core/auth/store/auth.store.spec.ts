import { Mocked } from 'vitest';
import { AuthStore, AuthStoreInstance } from './auth.store';
import { AuthService } from '../auth.service';
import { TestBed } from '@angular/core/testing';
import { LoginResponseDto } from '../dto/login.dtos';
import { of } from 'rxjs';
import * as jwtDecoder from 'jwt-decode';
import { AuthState } from './auth.state';
import { AdminPrivileges } from '../types/admin-data.types';
import { patchState } from '@ngrx/signals';

vi.mock('jwt-decode', () => ({ jwtDecode: vi.fn() }));

describe('AuthStore', () => {
  let store: AuthStoreInstance;
  let authService: Mocked<AuthService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        {
          provide: AuthService,
          useValue: { login: vi.fn(), refreshToken: vi.fn() },
        },
      ],
    });

    store = TestBed.inject(AuthStore) as AuthStoreInstance;
    authService = TestBed.inject(AuthService) as Mocked<AuthService>;
  });

  it('should have initial profile value as null', () => {
    expect(store.admin()).toBeNull;
  });

  it('should update status after successful login', () => {
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

    const expectedAdminStateValue: AuthState['admin'] = {
      id: 1,
      displayName: 'displayName',
      handleName: 'handleName',
      avatarUrl: null,
      privileges: new Set(['ADMINS_MANAGE']),
      verification: 'VERIFIED',
      isActivated: true,
    };

    authService.login.mockReturnValue(of(mockResponse));
    vi.mocked(jwtDecoder.jwtDecode).mockReturnValue({ options: { expiresIn: mockExpTime } });

    store.login({ identifier: 'handleName', password: 'password' });

    expect(store.admin()).toEqual(expectedAdminStateValue);
    expect(store.accessToken.token()).toBe(mockResponse.accessToken);
    expect(store.isLoading()).toBe(false);
  });

  describe('Privileges methods', () => {
    type CheckPrivilegesTestCase = {
      ownedPrivileges: AdminPrivileges;
      requiredPrivileges: AdminPrivileges;
      expected: boolean;
      desc: string;
    };
    const checkPrivilegesCases: CheckPrivilegesTestCase[] = [
      {
        ownedPrivileges: new Set(['ADMINS_MANAGE']),
        requiredPrivileges: new Set(['ADMINS_MANAGE']),
        expected: true,
        desc: 'correct privileges',
      },
      {
        ownedPrivileges: new Set(['ADMINS_MANAGE']),
        requiredPrivileges: new Set(['BLOG_MANAGE']),
        expected: false,
        desc: 'insufficient privileges',
      },
    ];
    it.each(checkPrivilegesCases)(
      'should return $expected for scenario: $desc',
      ({ ownedPrivileges, requiredPrivileges, expected }) => {
        const mockAdminState: AuthState['admin'] = {
          id: 1,
          displayName: 'displayName',
          handleName: 'handle',
          avatarUrl: null,
          privileges: ownedPrivileges,
          verification: 'VERIFIED',
          isActivated: true,
        };

        patchState(store as any, { admin: { ...mockAdminState } });

        expect(store.hasAppropriatePrivileges(requiredPrivileges)).toBe(expected);
      },
    );
  });
});
