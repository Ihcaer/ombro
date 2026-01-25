import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AdminPrivileges } from '../enums/admin-privileges';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { PrivilegesGuard } from '../guards/privileges/privileges.guard';
import { VerifiedAndActivatedGuard } from '../guards/verified-and-activated.guard';

export const PRIVILEGES_KEY = 'privileges';

export function Auth(...privileges: AdminPrivileges[]) {
  return applyDecorators(
    SetMetadata(PRIVILEGES_KEY, privileges),
    UseGuards(AccessTokenGuard, PrivilegesGuard, VerifiedAndActivatedGuard),
  );
}
