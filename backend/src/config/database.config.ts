import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { validateConfig } from './env-config.validator';

class DbConfig {
  @Expose({ name: 'POSTGRES_URL' })
  @IsString()
  @IsNotEmpty()
  @IsUrl({
    protocols: ['postgresql'],
    require_protocol: true,
    require_valid_protocol: true,
    require_tld: false,
  })
  url: string;
}

export default registerAs('db', () => validateConfig(DbConfig));
