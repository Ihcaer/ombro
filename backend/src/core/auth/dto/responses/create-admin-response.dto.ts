import {
  AdminPrivilegesTranslated,
  AdminPrivilegeTranslatedField,
} from '@core/auth/types/admin.types.js';
import { AuthAdmin } from '@generated/prisma-client/client.js';

export class CreateAdminResponseDto implements Readonly<
  NonNullable<Pick<AuthAdmin, 'id' | 'displayName' | 'email'> & AdminPrivilegeTranslatedField>
> {
  readonly id!: AuthAdmin['id'];
  readonly displayName!: AuthAdmin['displayName'];
  readonly email!: AuthAdmin['email'];
  readonly privileges!: AdminPrivilegesTranslated[];
}
