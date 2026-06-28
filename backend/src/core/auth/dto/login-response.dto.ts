import {
  AdminAvatarUrlField,
  AdminData,
  AdminPrivilegeTranslatedField,
} from '../types/admin.types';

export type LoginResponseDto = {
  readonly accessToken: string;
  readonly adminData: Omit<AdminData, 'privileges' | 'avatarFileId'> &
    AdminPrivilegeTranslatedField &
    AdminAvatarUrlField;
};
