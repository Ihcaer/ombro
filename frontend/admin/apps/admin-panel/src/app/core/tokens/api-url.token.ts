import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment.example';

export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => {
    let base = environment.apiDomain;
    const slug = environment.apiSlug ?? '';

    if (base && !base.startsWith('http') && !base.includes('localhost')) base = `https://${base}`;

    return `${base}${slug.startsWith('/') ? slug : '/' + slug}`;
  },
});
