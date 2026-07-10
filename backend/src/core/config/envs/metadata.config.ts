import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { validateConfig } from '../env-config.validator';

export class MetadataConfig {
  @Expose({ name: 'APP_MAIN_DOMAIN' })
  @IsString()
  @IsNotEmpty()
  mainDomain!: string;

  @Expose({ name: 'APP_MEDIA_DOMAIN' })
  @IsString()
  @IsNotEmpty()
  mediaDomain!: string;
}

export default registerAs('metadata', () => validateConfig(MetadataConfig));
