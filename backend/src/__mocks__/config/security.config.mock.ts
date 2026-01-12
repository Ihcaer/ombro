import { SecurityConfig } from '@core/config/envs/security.config';
import { plainToInstance } from 'class-transformer';

type RawSecurityEnv = {
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  HASH_SECRET: string;
};

export const createSecurityConfigMock = (
  overrides: Partial<RawSecurityEnv> = {},
): SecurityConfig => {
  const defaultValues: RawSecurityEnv = {
    JWT_ACCESS_SECRET: 'access-secret',
    JWT_REFRESH_SECRET: 'refresh-secret',
    HASH_SECRET: 'hash-secret',
  };

  return plainToInstance(SecurityConfig, { ...defaultValues, ...overrides });
};
