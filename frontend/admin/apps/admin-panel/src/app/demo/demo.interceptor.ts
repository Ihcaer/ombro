import { HttpInterceptorFn } from '@angular/common/http';
import { MOCK_REGISTRY } from './mock-registry';
import { delay, of } from 'rxjs';

export const demoInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Demo interceptor');
  console.log(`[Demo mode] Intercepted request to: ${req.url}`);

  const match = MOCK_REGISTRY.find((mock) => {
    if (req.method !== mock.config.method) return false;

    if (mock.matchType === 'exact') {
      return req.url.endsWith(mock.config.path);
    } else {
      return req.url.includes(mock.config.path);
    }
  });

  if (match) {
    return of(match.handler(req)).pipe(delay(match.delayMs));
  } else {
    return next(req);
  }
};
