import { Admin } from '../types/admin-data.types';

export type LoginRequestDto = { readonly identifier: string; readonly password: string };

export type LoginResponseDto = { readonly jwt: string; readonly adminData: Admin };
