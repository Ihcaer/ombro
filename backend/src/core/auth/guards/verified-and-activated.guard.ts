import { getRequestUser } from '@core/auth/utils/request-user.util.js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class VerifiedAndActivatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = getRequestUser(context);

    if (!user || user.verification !== 'VERIFIED' || !user.isActivated) {
      return false;
    } else {
      return true;
    }
  }
}
