import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { PrivilegesGuard } from '../guards/privileges/privileges.guard';
import { VerifiedAndActivatedGuard } from '../guards/verified-and-activated.guard';
import { AdminPrivilegesTranslated } from '../types/admin.types';
import { PrivilegesUtils } from '../utils/privileges.utils';

export const PRIVILEGES_KEY = 'privileges';

export function Auth(...privileges: AdminPrivilegesTranslated[]) {
  const privilegesEnum = PrivilegesUtils.convertToEnumTable([...privileges]);
  return applyDecorators(
    SetMetadata(PRIVILEGES_KEY, privilegesEnum),
    UseGuards(AccessTokenGuard, PrivilegesGuard, VerifiedAndActivatedGuard),
  );
}
