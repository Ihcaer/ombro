import { AuthAdmin } from '@generated/prisma-client';
import { AdminPrivilegesTranslated, AdminPrivilegeTranslatedField } from '../types/admin.types';

export class CreateAdminResponseDto implements Readonly<
  NonNullable<Pick<AuthAdmin, 'displayName' | 'email'> & AdminPrivilegeTranslatedField>
> {
  readonly displayName!: string;

  readonly email!: string;

  readonly privileges!: AdminPrivilegesTranslated[];
}
