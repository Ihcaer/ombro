import { Admin } from '../types/admin-data.types';

export type LoginRequest = { readonly identifier: string; readonly password: string };

export type LoginResponse = { readonly jwt: string; readonly adminData: Admin };
