import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../guards/access-token.guard.js';
import { PrivilegesGuard } from '../guards/privileges/privileges.guard.js';
import { VerifiedAndActivatedGuard } from '../guards/verified-and-activated.guard.js';
import { AdminPrivilegesTranslated } from '../types/admin.types.js';
import { PrivilegesUtils } from '../utils/privileges.utils.js';
import { RefreshTokenGuard } from '../guards/refresh-token.guard.js';

export const Public = () => applyDecorators();

export const PRIVILEGES_KEY = 'privileges';
export const Admin = (...privileges: AdminPrivilegesTranslated[]) => {
  const privilegesEnum = PrivilegesUtils.convertToEnumTable([...privileges]);
  return applyDecorators(
    SetMetadata(PRIVILEGES_KEY, privilegesEnum),
    UseGuards(AccessTokenGuard, VerifiedAndActivatedGuard, PrivilegesGuard),
  );
};

export const AuthRefresh = () => applyDecorators(UseGuards(RefreshTokenGuard));
