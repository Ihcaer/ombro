import { jwtDecode } from 'jwt-decode';
import { AccessTokenPayload } from '../types/jwt.types';
import { AUTH_PATH_SLUG, AUTH_PAGE_PATHS } from '@ombro/admin-panel/app/features/auth/auth-paths';
import { demoAccessToken } from '@ombro/admin-panel/app/demo/response-mocks/auth-responses.mock';

export const getAccessTokenExpirationTimeMs = (token: string): number => {
  if (token === demoAccessToken) {
    const accessTokenExpiration = Date.now() + 1000 * 60 * 2;
    console.log(
      '[Demo mode] new access token expiration time:',
      new Date(accessTokenExpiration).toLocaleTimeString(),
    );
    return accessTokenExpiration;
  }
  return jwtDecode<AccessTokenPayload>(token).exp * 1000;
};
export const loginPagePath = `/${AUTH_PATH_SLUG}/${AUTH_PAGE_PATHS.LOGIN}` as const;
