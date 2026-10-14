import { getRequestUserFromExecutionContext } from '@core/auth/utils/request-user-from-execution-context.util.js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class VerifiedAndActivatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = getRequestUserFromExecutionContext(context);

    if (!user || user.verification !== 'VERIFIED' || !user.isActivated) {
      return false;
    } else {
      return true;
    }
  }
}
