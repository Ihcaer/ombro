import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPort,
  IsString,
} from 'class-validator';
import { validateConfig } from './env-config.validator';

export enum Environment {
  Development = 'dev',
  Production = 'prod',
  Test = 'test',
}

class ServerConfig {
  @Expose({ name: 'NODE_ENV' })
  @IsEnum(Environment, {
    message:
      'nodeEnv must be one of the following values: ' +
      Object.values(Environment).join(', '),
  })
  nodeEnv: string;

  @Expose({ name: 'API_PORT' })
  @IsNumber()
  @IsPort()
  port: number;

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

export default registerAs('server', () => validateConfig(ServerConfig));
