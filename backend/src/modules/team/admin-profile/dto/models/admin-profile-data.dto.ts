import { AdminPrivilegeTranslatedField } from '@core/auth/types/admin.types.js';
import { AuthAdmin } from '@generated/prisma-client/client.js';

export interface AdminProfileDataDto
  extends
    Pick<
      AuthAdmin,
      'displayName' | 'handleName' | 'email' | 'lastLogged' | 'verification' | 'isActivated'
    >,
    AdminPrivilegeTranslatedField {
  avatarUrl: string | null;
}
