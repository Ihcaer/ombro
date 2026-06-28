import { Admin, AdminPrivilege } from '../types/admin-data.types';

type AdminApiData = Readonly<Omit<Admin, 'privileges'> & { privileges: AdminPrivilege[] }>;

export type LoginRequestDto = { readonly identifier: string; readonly password: string };

export type LoginResponseDto = { readonly accessToken: string; readonly adminData: AdminApiData };
