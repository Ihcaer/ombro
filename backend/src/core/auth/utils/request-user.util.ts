import { ExecutionContext } from '@nestjs/common';
import { AccessJwtPayload } from '../types/jwt.types.js';

interface RequestWithUser extends Request {
  user: AccessJwtPayload;
}

export const getRequestUser = (ctx: ExecutionContext) => {
  if (ctx.getType() !== 'http') return undefined;
  return ctx.switchToHttp().getRequest<RequestWithUser>().user;
};
