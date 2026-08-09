import { ApiProperty } from '@nestjs/swagger';
import { AdminPrivileges } from '../enums/admin-privileges';
import {
  AdminData,
  AdminPrivilegeTranslatedField,
  AdminAvatarUrlField,
  AdminPrivilegesTranslated,
} from '../types/admin.types';

export class AdminDataDto
  implements
    Omit<AdminData, 'privileges' | 'avatarFileId'>,
    AdminPrivilegeTranslatedField,
    AdminAvatarUrlField
{
  // Internal static constants (ignored by Swagger)
  static readonly EXCLUDED_PRIVILEGES: (keyof typeof AdminPrivileges)[] = ['NONE'];
  static readonly SAMPLE_ADMIN_PRIVILEGES: AdminPrivilegesTranslated[] = [
    'ADMINS_MANAGE',
    'BLOG_MANAGE',
  ];

  readonly id!: AdminData['id'];

  readonly displayName!: AdminData['displayName'];

  readonly handleName!: AdminData['handleName'];

  readonly privileges!: AdminPrivilegesTranslated[];

  readonly verification!: AdminData['verification'];

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
