import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { initialState } from './one-time-token.state';
import { computed } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

const getInitialState = () => ({ ...initialState });

export const OneTimeTokenStore = signalStore(
  withState(getInitialState()),
  withComputed(({ oneTimeToken }) => ({ hasToken: computed(() => !!oneTimeToken()) })),
  withMethods((store) => ({
    clear(): void {
      patchState(store, getInitialState());
    },
  })),
  withMethods((store) => ({
    initializeFromRoute(snapshot: ActivatedRouteSnapshot): void {
      const token = snapshot.paramMap.get('token');
      if (token) patchState(store, { oneTimeToken: token, type: 'url_magic_link' });
    },
  })),
);
