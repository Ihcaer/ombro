import { applyDecorators, Controller } from '@nestjs/common';
import { Admin, AuthRefresh, Public } from './auth.decorators';
import { AdminPrivilegesTranslated } from '../types/admin.types';

const PUBLIC_PREFIX = 'public';
const ADMIN_PREFIX = 'admin';

export const PublicController = (moduleName: string, featureName?: string) => {
  const path = PUBLIC_PREFIX + cleanPath(moduleName) + (featureName ? cleanPath(featureName) : '');
  return applyDecorators(Controller(path), Public());
};

export const AdminController = (
  moduleName: string,
  featureName?: string,
  privileges: AdminPrivilegesTranslated[] = [],
) => {
  const path = ADMIN_PREFIX + cleanPath(moduleName) + (featureName ? cleanPath(featureName) : '');
  return applyDecorators(Controller(path), Admin(...privileges));
};

export const RefreshController = (moduleName: string, featureName?: string) => {
  const path = ADMIN_PREFIX + cleanPath(moduleName) + (featureName ? cleanPath(featureName) : '');
  return applyDecorators(Controller(path), AuthRefresh());
};

const cleanPath = (path: string): string => {
  if (path.endsWith('/')) path = path.slice(0, -1);
  if (!path.startsWith('/')) path = '/' + path;
  return path;
};
