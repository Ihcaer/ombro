import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@ombro/admin-panel/environments/environment.example';

export type ApiScope = keyof typeof environment.api.endpoints;

export const API_SCOPE = new HttpContextToken<ApiScope>(() => 'public');

export const withApiScopeContext = (scope: ApiScope): HttpContext =>
  new HttpContext().set(API_SCOPE, scope);
export const withApiScopeAsHttpOptions = (scope: ApiScope) => {
  return { context: withApiScopeContext(scope) };
};

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('http://') || req.url.startsWith('https://')) return next(req);

  const domain = environment.api.domain;
  const baseUrl = environment.api.baseUrl;
  const scopeKey = req.context.get(API_SCOPE);
  const scopeSegment = environment.api.endpoints[scopeKey] || 'public';

  const prefix = createApiPrefix(domain, baseUrl, scopeSegment);
  const requestPath = req.url.startsWith('/') ? req.url : '/' + req.url;

  const apiReq = req.clone({
    url: prefix + requestPath,
  });

  return next(apiReq);
};

const createApiPrefix = (domain: string, baseUrl: string, scope: string): string => {
  const cleanBaseUrl = baseUrl.startsWith('/') ? baseUrl : '/' + baseUrl;
  const cleanScope = scope.startsWith('/') ? scope : '/' + scope;

  if (!domain) return cleanBaseUrl + cleanScope;

  let fullDomain = domain;
  if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
    const protocol = domain.startsWith('localhost') ? 'http://' : 'https://';
    fullDomain = protocol + domain;
  }

  const cleanDomain = fullDomain.endsWith('/') ? fullDomain.slice(0, -1) : fullDomain;

  return cleanDomain + cleanBaseUrl + cleanScope;
};
