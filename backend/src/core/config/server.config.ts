import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsPort } from 'class-validator';
import { validateConfig } from './env-config.validator';

export enum Environment {
  Development = 'dev',
  Production = 'prod',
  Test = 'test',
}

export class ServerConfig {
  @Expose({ name: 'NODE_ENV' })
  @IsEnum(Environment, {
    message:
      'nodeEnv must be one of the following values: ' +
      Object.values(Environment).join(', '),
  })
  nodeEnv: Environment;

  @Expose({ name: 'API_PORT' })
  @IsNumber()
  @IsPort()
  port: number;
}

export default registerAs('server', () => validateConfig(ServerConfig));
