import { ApiProperty } from '@nestjs/swagger';
import { enumKeysWithout } from '@shared/swagger/enum-keys-without.helper';
import { AdminPrivileges } from '../enums/admin-privileges';
import {
  AdminData,
  AdminPrivilegeTranslatedField,
  AdminAvatarUrlField,
  AdminPrivilegesTranslated,
} from '../types/admin.types';
import { AuthVerification } from '@generated/prisma-client';

export class AdminDataDto
  implements
    Omit<AdminData, 'privileges' | 'avatarFileId'>,
    AdminPrivilegeTranslatedField,
    AdminAvatarUrlField
{
  static readonly EXCLUDED_PRIVILEGES: (keyof typeof AdminPrivileges)[] = ['NONE'];
  static readonly SAMPLE_ADMIN_PRIVILEGES: AdminPrivilegesTranslated[] = [
    'ADMINS_MANAGE',
    'BLOG_MANAGE',
  ];

  @ApiProperty({ readOnly: true, type: Number })
  readonly id!: AdminData['id'];

  @ApiProperty({ readOnly: true, type: String })
  readonly displayName!: AdminData['displayName'];

  @ApiProperty({ readOnly: true, type: String })
  readonly handleName!: AdminData['handleName'];

  @ApiProperty({
    readOnly: true,
    enum: enumKeysWithout(AdminPrivileges, AdminDataDto.EXCLUDED_PRIVILEGES),
    isArray: true,
    example: AdminDataDto.SAMPLE_ADMIN_PRIVILEGES,
  })
  readonly privileges!: AdminPrivilegesTranslated[];

  @ApiProperty({ readOnly: true, enum: AuthVerification })
  readonly verification!: AdminData['verification'];

  @ApiProperty({ readOnly: true, type: Boolean })
  readonly isActivated!: AdminData['isActivated'];

  @ApiProperty({
    readOnly: true,
    type: String,
    nullable: true,
    format: 'uri-reference',
    example: null,
  })
  readonly avatarUrl!: AdminAvatarUrlField['avatarUrl'];
}
