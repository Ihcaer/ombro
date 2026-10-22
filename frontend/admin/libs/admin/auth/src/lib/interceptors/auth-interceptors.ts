import { authInterceptor } from './auth/auth.interceptor';
import { adminTokenInterceptor } from './admin-token/admin-token.interceptor';
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptors = (): HttpInterceptorFn[] => [authInterceptor, adminTokenInterceptor];
