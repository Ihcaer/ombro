import { HttpErrorResponse } from '@angular/common/http';
import { Admin } from '../types/admin-data.types';

export type AuthStateInternalError = 'SESSION_REFRESH_FAILED';

export type AuthState = {
  admin: Admin | null;
  accessToken: { token: string | null; expiresAtMs: number | null };
  isLoading: boolean;
  lastResponseError: HttpErrorResponse | null;
  lastInternalError: AuthStateInternalError | null;
};

export const initialState: Readonly<AuthState> = {
  admin: null,
  accessToken: { token: null, expiresAtMs: null },
  isLoading: false,
  lastResponseError: null,
  lastInternalError: null,
};
