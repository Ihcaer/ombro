import { AuthAdmin } from '@generated/prisma-client';
import { AdminPrivilegeTranslatedField } from '../types/admin.types';

export type CreateAdminResponseDto = Readonly<
  NonNullable<Pick<AuthAdmin, 'displayName' | 'email'> & AdminPrivilegeTranslatedField>
>;
