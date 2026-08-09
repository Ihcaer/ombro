import { AuthAdmin } from '@generated/prisma-client';
import { AdminPrivileges } from '../enums/admin-privileges';

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
>;

export type AdminPrivilegesTranslated = Exclude<keyof typeof AdminPrivileges, 'NONE'>;
export interface AdminPrivilegeTranslatedField {
  privileges: AdminPrivilegesTranslated[];
}

export type AdminAvatarUrlField = { avatarUrl: string | null };
