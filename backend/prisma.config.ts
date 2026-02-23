import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { defineConfig, env } from 'prisma/config';

const envFileName: string = '.env.local';

if (existsSync(envFileName)) {
  const envFromFile = loadEnvFile(envFileName) ?? {};
  for (const [key, value] of Object.entries(envFromFile)) {
    if (typeof value === 'string' && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

export default defineConfig({
  schema: 'prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('POSTGRES_URL'),
  },
});
