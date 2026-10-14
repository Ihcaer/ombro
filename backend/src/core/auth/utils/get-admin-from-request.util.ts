import { Request } from 'express';
import { AccessJwtPayload } from '../types/jwt.types.js';

/**
 * Retrieves the access token (JWT) admin payload attached to the request by Passport.
 *
 * @param req - The incoming Express request.
 * @return The extracted admin (user) payload.
 */
export const getAdminFromRequest = (req: Request): AccessJwtPayload => req.user as AccessJwtPayload;
