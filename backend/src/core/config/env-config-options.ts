import { ConfigModuleOptions } from '@nestjs/config';
import { getEnvPath } from './env-path.util';
import { Environment } from './envs/server.config';

const nodeEnv = (process.env.NODE_ENV as Environment) || Environment.Development;

export const getConfigOptions = (): ConfigModuleOptions => ({
  ignoreEnvFile: nodeEnv === Environment.Production,
  envFilePath: getEnvPath(),
  cache: nodeEnv !== Environment.Test,
});
