import { jwtDecode } from 'jwt-decode';
import { AccessTokenPayload } from '../types/jwt.types';
import { AUTH_PATH_SLUG, AUTH_PAGE_PATHS } from '@ombro/admin-panel/app/features/auth/auth-paths';

export const getAccessTokenExpirationTimeMs = (token: string): number =>
  jwtDecode<AccessTokenPayload>(token).exp * 1000;

export const loginPagePath = `/${AUTH_PATH_SLUG}/${AUTH_PAGE_PATHS.LOGIN}` as const;
