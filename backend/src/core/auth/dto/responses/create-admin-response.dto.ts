import {
  AdminPrivilegesTranslated,
  AdminPrivilegeTranslatedField,
} from '@core/auth/types/admin.types';
import { AuthAdmin } from '@generated/prisma-client';

export class CreateAdminResponseDto implements Readonly<
  NonNullable<Pick<AuthAdmin, 'displayName' | 'email'> & AdminPrivilegeTranslatedField>
> {
  readonly displayName!: string;

  readonly email!: string;

  readonly privileges!: AdminPrivilegesTranslated[];
}
