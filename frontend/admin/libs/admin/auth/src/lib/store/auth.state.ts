import { HttpErrorResponse } from '@angular/common/http';

export type AuthStateInternalError = 'SESSION_REFRESH_FAILED';

export type AuthState = {
  accessToken: { token: string | null; expiresAtMs: number | null };
  isLoading: boolean;
  lastResponseError: HttpErrorResponse | null;
  lastInternalError: AuthStateInternalError | null;
};

export const initialState: Readonly<AuthState> = {
  accessToken: { token: null, expiresAtMs: null },
  isLoading: false,
  lastResponseError: null,
  lastInternalError: null,
};
