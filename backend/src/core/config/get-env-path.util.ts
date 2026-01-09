import { existsSync } from 'node:fs';
import { Environment } from './server.config';
import { resolve } from 'node:path';
import { argv } from 'node:process';

export const getEnvPath = (): string[] => {
  const isTest = argv.some(
    (arg) => arg.includes('test') || arg.includes('jest'),
  );
  const env = isTest
    ? Environment.Test
    : (process.env.NODE_ENV as Environment) || Environment.Development;

  let filename: string;

  switch (env) {
    case Environment.Test:
      filename = '.env.test';
      break;
    case Environment.Development:
      filename = '.env.local';
      break;
    default:
      return [];
  }

  const potentialPaths = [resolve(filename), resolve('..', filename)] as const;
  const foundPath = potentialPaths.find((p) => existsSync(p));

  return foundPath ? [foundPath] : [];
};
