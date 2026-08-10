import { HttpErrorResponse } from '@angular/common/http';
import { AdminDto } from '@ombro/shared/data-access/api-client';
import { AdminPrivileges } from '../types/admin-data.types';

export type AuthStateInternalError = 'SESSION_REFRESH_FAILED';

type AdminState = Omit<AdminDto, 'privileges'> & { privileges: AdminPrivileges };

export type AuthState = {
  admin: AdminState | null;
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
