import { ConfigModuleOptions } from '@nestjs/config';
import { getEnvPath } from './env-path.util.js';
import { Environment } from './envs/server.config.js';

const nodeEnv = (process.env.NODE_ENV as Environment) || Environment.Development;

export const getConfigOptions = (): ConfigModuleOptions => ({
  ignoreEnvFile: nodeEnv === Environment.Production,
  envFilePath: getEnvPath(),
  cache: nodeEnv !== Environment.Test,
});
