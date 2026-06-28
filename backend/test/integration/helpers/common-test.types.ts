import { CreateAdminRequestDto } from '@core/auth/dto';
import { AdminPrivilegeTranslatedField } from '@core/auth/types/admin.types';

export type TestCreateAdminRequestDto = Omit<CreateAdminRequestDto, 'privileges'> &
  AdminPrivilegeTranslatedField;
