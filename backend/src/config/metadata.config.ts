import { registerAs } from '@nestjs/config';

export interface MetadataConfig {
  mainDomain: string;
  mediaDomain: string;
}

export default registerAs('metadata', () => ({
  mainDomain: process.env.APP_MAIN_DOMAIN as string,
  mediaDomain: process.env.APP_MEDIA_DOMAIN as string,
}));
