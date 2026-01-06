import { DatabaseConfig } from '@core/config/database.config';
import { plainToInstance } from 'class-transformer';

type RawDatabaseEnv = { POSTGRES_URL: string };

export const createDatabaseConfigMock = (
  overrides: Partial<RawDatabaseEnv> = {},
): DatabaseConfig => {
  const defaultValues: RawDatabaseEnv = {
    POSTGRES_URL: 'postgresql://user:password@localhost:5432/db-name',
  };

  return plainToInstance(DatabaseConfig, { ...defaultValues, ...overrides });
};
