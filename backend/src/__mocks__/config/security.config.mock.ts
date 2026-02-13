import { SecurityConfig } from '@core/config/envs/security.config';
import { plainToInstance } from 'class-transformer';

type RawSecurityEnv = {
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  REQUEST_BASE_DELAY: number;
  REQUEST_JITTER: number;
};

export const createSecurityConfigMock = (
  overrides: Partial<RawSecurityEnv> = {},
): SecurityConfig => {
  const defaultValues: RawSecurityEnv = {
    JWT_ACCESS_SECRET: 'access-secret',
    JWT_REFRESH_SECRET: 'refresh-secret',
    REQUEST_BASE_DELAY: 20,
    REQUEST_JITTER: 0,
  };

  return plainToInstance(SecurityConfig, { ...defaultValues, ...overrides });
};
