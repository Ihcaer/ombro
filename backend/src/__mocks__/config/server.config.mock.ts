import { Environment, ServerConfig } from '@core/config/envs/server.config';
import { plainToInstance } from 'class-transformer';

type RawServerEnv = { NODE_ENV: Environment; API_PORT: number };

export const createServerConfigMock = (
  overrides: Partial<RawServerEnv> = {},
): ServerConfig => {
  const defaultValues: RawServerEnv = {
    NODE_ENV: Environment.Test,
    API_PORT: 3000,
  };

  return plainToInstance(ServerConfig, { ...defaultValues, ...overrides });
};
