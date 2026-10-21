import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { AdminUser, AdminPrivileges } from '../models/admin-user.model';
import { AdminDtoPrivilegesItem } from '@ombro/shared/data-access/api-client';

type UserState = {
  user: AdminUser | null;
};

const initialState: Readonly<UserState> = {
  user: null,
};

const getInitialState = () => structuredClone(initialState);

export const UserStore = signalStore(
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
    hasPrivilege(privilege: string): boolean {
      const userPrivileges = user()?.privileges;
      if (!userPrivileges) return false;
      return userPrivileges.has(privilege as unknown as AdminDtoPrivilegesItem);
    },
    hasAppropriatePrivileges(neededPrivileges: Set<string>): boolean {
      const userData = user();
      if (!userData || !userData.privileges || neededPrivileges.size === 0) return false;
      if (neededPrivileges.size === 0) return true;

      const userPrivileges: AdminPrivileges = userData.privileges;

      if (neededPrivileges.size > userPrivileges.size) return false;
      return [...neededPrivileges].every((privilege) => userPrivileges.has(privilege as unknown as AdminDtoPrivilegesItem));
    },
  })),
  withComputed(({ user }) => ({
    userId: computed(() => user()?.id),
    displayName: computed(() => user()?.displayName),
    handleName: computed(() => user()?.handleName),
    avatarUrl: computed(() => user()?.avatarUrl),
    isActivated: computed(() => user()?.isActivated),
    verification: computed(() => user()?.verification),
    userPrivileges: computed(() => user()?.privileges),
  })),
);

export type UserStoreInstance = InstanceType<typeof UserStore>;
