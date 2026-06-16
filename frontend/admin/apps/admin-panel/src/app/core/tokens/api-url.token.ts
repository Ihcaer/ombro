import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment.example';

export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => {
    let base = environment.apiDomain;
    const slug = environment.apiSlug ?? '';

    if (base && !base.startsWith('http')) {
      if (base.includes('localhost')) {
        base = `http://${base}`;
      } else {
        base = `https://${base}`;
      }
    }

    const separator = base && !base.endsWith('/') && !slug.startsWith('/') ? '/' : '';
    return `${base}${separator}${slug}`;
  },
});
