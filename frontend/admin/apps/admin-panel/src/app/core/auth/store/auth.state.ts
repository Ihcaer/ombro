import { HttpErrorResponse } from '@angular/common/http';
import { Admin } from '../types/admin-data.types';

export type AuthState = {
  admin: Admin | null;
  accessToken: { token: string | null; expiresAtMs: number | null };
  isLoading: boolean;
  lastErrorResponse: HttpErrorResponse | null;
};

export const initialState: Readonly<AuthState> = {
  admin: null,
  accessToken: { token: null, expiresAtMs: null },
  isLoading: false,
  lastErrorResponse: null,
};
