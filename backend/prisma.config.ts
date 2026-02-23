import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadEnvFile } from 'node:process';
import { defineConfig, env } from 'prisma/config';

const envSources: string[] = [
  join(__dirname, '..', '.env'),
  join(__dirname, '..', '.env.local'),
  join(__dirname, '..', '.env.test'),
  join(__dirname, '.env'),
  join(__dirname, '.env.local'),
  join(__dirname, '.env.test'),
  join(__dirname, '..', '.env.example'),
] as string[];

for (const envPath of envSources) {
  if (existsSync(envPath)) {
    const envFromFile = loadEnvFile(envPath) ?? {};
    for (const [key, value] of Object.entries(envFromFile)) {
      if (typeof value === 'string' && !(key in process.env)) {
        process.env[key] = value;
      }
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
