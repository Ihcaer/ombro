import { PRIVILEGES_KEY } from '@core/auth/decorators/auth.decorator';
import { AdminPrivileges } from '@core/auth/enums/admin-privileges';
import { PrivilegesUtils } from '@core/auth/utils/privileges.utils';
import { getRequestUser } from '@core/auth/utils/request-user.util';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PrivilegesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPrivileges = this.reflector.getAllAndOverride<
      AdminPrivileges[]
    >(PRIVILEGES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredPrivileges) return true;

    const privileges = getRequestUser(context)?.privileges;
    if (typeof privileges !== 'number') return false;

    return PrivilegesUtils.hasAll(privileges, requiredPrivileges);
  }
}
