import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { privilegesGuard } from './privileges.guard';
import { AuthStore, AuthStoreInstance } from '../../store';
import { AdminUserStore, AdminUserStoreInstance } from '@ombro/admin-user';
import { Mocked } from 'vitest';
import { AppRouteData } from '@ombro/admin-panel/app/core/config/types/routing.types';

describe('privilegesGuard', () => {
  let authStore: Mocked<AuthStoreInstance>;
  let userStore: Mocked<AdminUserStoreInstance>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => privilegesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AdminUserStore, useValue: { hasAppropriatePrivileges: vi.fn() } }],
    });

    authStore = TestBed.inject(AuthStore) as Mocked<AuthStoreInstance>;
    userStore = TestBed.inject(AdminUserStore) as Mocked<AdminUserStoreInstance>;
  });

  const dummyRouterState = {} as RouterStateSnapshot;

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  type testCase = {
    requiredPrivileges: Set<string>;
    hasRequiredPrivileges: boolean;
    expected: boolean;
    desc: string;
  };
  const cases: testCase[] = [
    {
      requiredPrivileges: new Set(['ADMINS_MANAGE']),
      hasRequiredPrivileges: true,
      expected: true,
      desc: 'correct privileges',
    },
    {
      requiredPrivileges: new Set(['ADMINS_MANAGE']),
      hasRequiredPrivileges: false,
      expected: false,
      desc: 'insufficient privileges',
    },
  ];
  it.each(cases)(
    'should return $expected for scenario: $desc',
    ({ requiredPrivileges, hasRequiredPrivileges, expected }) => {
      const mockRoute = {
        data: { privilegesRequired: requiredPrivileges } as Partial<AppRouteData>,
        pathFromRoot: [{ data: {} }],
      } as ActivatedRouteSnapshot;

      userStore.hasAppropriatePrivileges.mockReturnValue(hasRequiredPrivileges);

      const result = executeGuard(mockRoute, dummyRouterState);

      expect(result).toBe(expected);
      expect(userStore.hasAppropriatePrivileges).toHaveBeenCalledOnce();
    },
  );
});
