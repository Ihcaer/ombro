import { AuthAdmin } from '@generated/prisma-client';

export type AdminDto = Readonly<
  Pick<
    AuthAdmin,
    | 'id'
    | 'displayName'
    | 'handleName'
    | 'password'
    | 'avatarId'
    | 'privileges'
    | 'verification'
    | 'isActivated'
  >
>;
