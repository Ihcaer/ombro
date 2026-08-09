import { AuthAdmin } from '@generated/prisma-client';
import { AdminPrivilegesTranslated, AdminPrivilegeTranslatedField } from '../types/admin.types';
import { ApiProperty } from '@nestjs/swagger';
import { enumKeysWithout } from '@shared/swagger/enum-keys-without.helper';
import { AdminPrivileges } from '../enums/admin-privileges';
import { AdminDataDto } from './admin-data.dto';

export class CreateAdminResponseDto implements Readonly<
  NonNullable<Pick<AuthAdmin, 'displayName' | 'email'> & AdminPrivilegeTranslatedField>
> {
  @ApiProperty({ readOnly: true })
  readonly displayName!: string;

  @ApiProperty({ readOnly: true, format: 'email' })
  readonly email!: string;

  @ApiProperty({
    readOnly: true,
    enum: enumKeysWithout(AdminPrivileges, AdminDataDto.EXCLUDED_PRIVILEGES),
    enumName: 'AdminPrivilege',
    isArray: true,
    example: AdminDataDto.SAMPLE_ADMIN_PRIVILEGES,
  })
  readonly privileges!: AdminPrivilegesTranslated[];
}
