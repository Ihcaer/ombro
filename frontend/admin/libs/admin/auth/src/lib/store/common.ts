import { jwtDecode } from 'jwt-decode';
import { AccessTokenPayload } from '../types/jwt.types';

export const getAccessTokenExpirationTimeMs = (token: string): number =>
  jwtDecode<AccessTokenPayload>(token).exp * 1000;
