import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@ombro/admin-panel/environments/environment.example';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('http://') || req.url.startsWith('https://')) return next(req);

  const domain = environment.api.domain;
  const baseUrl = environment.api.baseUrl;

  const prefix = createApiPrefix(domain, baseUrl);
  const requestPath = req.url.startsWith('/') ? req.url : '/' + req.url;

  const apiReq = req.clone({
    url: prefix + requestPath,
  });

  return next(apiReq);
};

const createApiPrefix = (domain: string, baseUrl: string): string => {
  const paddedUrl = baseUrl.startsWith('/') ? baseUrl : '/' + baseUrl;
  const cleanBaseUrl = paddedUrl.endsWith('/') ? paddedUrl.slice(0, -1) : paddedUrl;

  if (!domain) return cleanBaseUrl;

  let fullDomain = domain;
  if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
    const protocol = domain.startsWith('localhost') ? 'http://' : 'https://';
    fullDomain = protocol + domain;
  }

  const cleanDomain = fullDomain.endsWith('/') ? fullDomain.slice(0, -1) : fullDomain;

  return cleanDomain + cleanBaseUrl;
};
