import {
  AdminPrivilegesTranslated,
  AdminPrivilegeTranslatedField,
} from '@core/auth/types/admin.types.js';
import { AuthAdmin } from '@generated/prisma-client/client.js';

export class CreateAdminResponseDto implements Readonly<
  NonNullable<Pick<AuthAdmin, 'displayName' | 'email'> & AdminPrivilegeTranslatedField>
> {
  readonly displayName!: string;

  readonly email!: string;

  readonly privileges!: AdminPrivilegesTranslated[];
}
