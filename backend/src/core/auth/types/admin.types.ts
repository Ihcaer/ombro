import { AuthAdmin } from '@generated/prisma-client/client.js';
import { AdminPrivileges } from '../enums/admin-privileges.js';
import { AdminPreferences } from '../dto/models/adminPreferences.dto.js';

export type Identifier = keyof Pick<AuthAdmin, 'email' | 'handleName'>;

export type AdminData = Pick<
  AuthAdmin,
  | 'id'
  | 'displayName'
  | 'handleName'
  | 'avatarFileId'
  | 'privileges'
  | 'verification'
  | 'isActivated'
> & { preferences: AdminPreferences };

export type FullAdminWithoutPasswordAndTimers = Omit<
  AuthAdmin,
  'password' | 'lastLogged' | 'createdAt' | 'updatedAt'
>;

export type FullAdminWithoutPasswordAndTimersBeforeAndAfter = {
  admin: FullAdminWithoutPasswordAndTimers;
  updatedAdmin: FullAdminWithoutPasswordAndTimers;
};

export type AdminWithPassword = Readonly<AdminData & Pick<AuthAdmin, 'password'>>;

export type NewlyCreatedAdmin = Readonly<
  Omit<AdminData, 'avatarFileId' | 'privileges' | 'preferences'> &
    AdminPrivilegeTranslatedField &
    Pick<AuthAdmin, 'email'>
>;

export type AdminWithoutPreferences = Omit<AuthAdmin, 'preferences'>;

export type AdminPrivilegesTranslated = Exclude<keyof typeof AdminPrivileges, 'NONE'>;
export interface AdminPrivilegeTranslatedField {
  privileges: AdminPrivilegesTranslated[];
}

export type AdminAvatarUrlField = { avatarUrl: string | null };
