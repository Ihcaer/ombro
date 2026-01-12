import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { validateConfig } from '../env-config.validator';

export class SecurityConfig {
  @Expose({ name: 'JWT_ACCESS_SECRET' })
  @IsString()
  @IsNotEmpty()
  jwtAccessSecret: string;

  @Expose({ name: 'JWT_REFRESH_SECRET' })
  @IsString()
  @IsNotEmpty()
  jwtRefreshSecret: string;

  @Expose({ name: 'HASH_SECRET' })
  @IsString()
  @IsNotEmpty()
  hashSecret: string;
}

export default registerAs('security', () => validateConfig(SecurityConfig));
