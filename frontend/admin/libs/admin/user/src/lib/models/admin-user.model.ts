import { AdminDtoPrivilegesItem, AdminDto } from '@ombro/shared/data-access/api-client';

export type AdminPrivileges = Set<AdminDtoPrivilegesItem>;

export type AdminPassword = string;

export type AdminUser = Omit<AdminDto, 'privileges'> & { privileges: AdminPrivileges };
