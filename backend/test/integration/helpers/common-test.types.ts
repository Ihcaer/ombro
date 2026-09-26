import { CreateAdminRequestDto } from '@core/auth/dto/index.js';
import { AdminPrivilegeTranslatedField } from '@core/auth/types/admin.types.js';

export type TestCreateAdminRequestDto = Omit<CreateAdminRequestDto, 'privileges'> &
  AdminPrivilegeTranslatedField;
