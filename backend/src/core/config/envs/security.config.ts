import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { validateConfig } from '../env-config.validator';
import { ToNumber } from '@core/auth/decorators/type-transformation.decorators';

export class SecurityConfig {
  @Expose({ name: 'JWT_ACCESS_SECRET' })
  @IsString()
  @IsNotEmpty()
  jwtAccessSecret!: string;

  @Expose({ name: 'JWT_REFRESH_SECRET' })
  @IsString()
  @IsNotEmpty()
  jwtRefreshSecret!: string;

  @Expose({ name: 'REQUEST_BASE_DELAY' })
  @ToNumber()
  @IsNumber()
  @Min(20)
  @Max(2000)
  requestBaseDelay!: number;

  @Expose({ name: 'REQUEST_JITTER' })
  @ToNumber()
  @IsNumber()
  @Min(0)
  @Max(500)
  requestJitter!: number;
}

export default registerAs('security', () => validateConfig(SecurityConfig));
