import { AuthAdmin } from '@generated/prisma-client/client.js';
import { AdminProfileDataResponseDto } from './dto/admin-profile-data-response.dto.js';
import { AdminOwnProfileDataResponseDto } from './dto/admin-own-profile-data-response.dto.js';

// Get admin own profile data types
type AdminOwnProfileNeededProperties = keyof AdminOwnProfileDataResponseDto;
export type AdminOwnProfileNeededColumnsFromDb = [
  AdminOwnProfileNeededProperties,
  AdminOwnProfileNeededProperties,
];

// Get admin profile data types
type AdminProfileNeededProperties = keyof (Omit<
  AdminProfileDataResponseDto,
  'avatarUrl' | 'privileges'
> &
  Pick<AuthAdmin, 'avatarFileId' | 'privileges'>);
export type AdminProfileNeededColumnsFromDb = [
  AdminProfileNeededProperties,
  AdminProfileNeededProperties,
  AdminProfileNeededProperties,
  AdminProfileNeededProperties,
  AdminProfileNeededProperties,
  AdminProfileNeededProperties,
  AdminProfileNeededProperties,
  AdminProfileNeededProperties,
];
