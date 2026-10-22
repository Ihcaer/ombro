import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AdminUser, AdminPrivileges } from '../models/admin-user.model';
import { AdminDtoPrivilegesItem } from '@ombro/shared/data-access/api-client';

type UserState = {
  user: AdminUser | null;
};

const initialState: Readonly<UserState> = {
  user: null,
};

const getInitialState = () => structuredClone(initialState);

export const AdminUserStore = signalStore(
  { providedIn: 'root' },
  withState(getInitialState),
  withMethods((store) => ({
    setUser(user: AdminUser): void {
      patchState(store, { user });
    },
    clearUser(): void {
      patchState(store, getInitialState);
    },
  })),
  withMethods(({ user }) => ({
    hasUser(): boolean {
      return !!user();
    },
    hasPrivilege(privilege: AdminDtoPrivilegesItem): boolean {
      const userPrivileges = user()?.privileges;
      if (!userPrivileges) return false;
      return userPrivileges.has(privilege);
    },
    hasAppropriatePrivileges(neededPrivileges: Set<AdminDtoPrivilegesItem>): boolean {
      const userData = user();
      if (!userData || !userData.privileges || neededPrivileges.size === undefined) return false;
      if (neededPrivileges.size === 0) return true;

      const userPrivileges: AdminPrivileges = userData.privileges;

      if (neededPrivileges.size > userPrivileges.size) return false;
      return [...neededPrivileges].every((privilege) => userPrivileges.has(privilege));
    },
  })),
);

export type AdminUserStoreInstance = InstanceType<typeof AdminUserStore>;
