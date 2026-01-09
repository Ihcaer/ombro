import { MetadataConfig } from '@core/config/envs/metadata.config';
import { plainToInstance } from 'class-transformer';

type RawMetadataEnv = { APP_MAIN_DOMAIN: string; APP_MEDIA_DOMAIN: string };

export const createMetadataConfigMock = (
  overrides: Partial<RawMetadataEnv> = {},
): MetadataConfig => {
  const defaultValues: RawMetadataEnv = {
    APP_MAIN_DOMAIN: 'example.com',
    APP_MEDIA_DOMAIN: 'example.com',
  };

  return plainToInstance(MetadataConfig, { ...defaultValues, ...overrides });
};
