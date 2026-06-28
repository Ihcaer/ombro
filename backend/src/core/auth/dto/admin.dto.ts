import { AuthAdmin } from '@generated/prisma-client';

export type AdminDto = Readonly<
  Pick<
    AuthAdmin,
    | 'id'
    | 'displayName'
    | 'handleName'
    | 'avatarFileId'
    | 'password'
    | 'privileges'
    | 'verification'
    | 'isActivated'
  >
>;
