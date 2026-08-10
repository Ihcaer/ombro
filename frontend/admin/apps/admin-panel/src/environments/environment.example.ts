import { EnvConfig } from '../app/core/config/interfaces/env-config.interface';

export const environment: EnvConfig = {
  production: false,
  api: { domain: '', baseUrl: '/api/v1' },
  coreFeatures: {},
  addonFeatures: {},
} as const;
