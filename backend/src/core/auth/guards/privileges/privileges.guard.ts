import { PRIVILEGES_KEY } from '@core/auth/decorators/index.js';
import { AdminPrivileges } from '@core/auth/enums/admin-privileges.js';
import { PrivilegesUtils } from '@core/auth/utils/privileges.utils.js';
import { getRequestUser } from '@core/auth/utils/request-user.util.js';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PrivilegesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPrivileges = this.reflector.getAllAndOverride<AdminPrivileges[]>(PRIVILEGES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPrivileges) return true;

    const privileges = getRequestUser(context)?.privileges;
    if (typeof privileges !== 'number') return false;

    const areCorrectPrivileges: boolean = PrivilegesUtils.hasAll(privileges, requiredPrivileges);
    if (!areCorrectPrivileges) throw new ForbiddenException('Insufficient privileges');

    return areCorrectPrivileges;
  }
}
