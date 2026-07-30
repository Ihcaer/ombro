import { registerAs } from '@nestjs/config';
import { ToNumber } from '@shared/decorators/type-transformation.decorators';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { validateConfig } from '../env-config.validator';

export class RedisQueueConfig {
  @Expose({ name: 'REDIS_QUEUE_HOST' })
  @IsString()
  @IsNotEmpty()
  host!: string;

  @Expose({ name: 'REDIS_QUEUE_PORT' })
  @ToNumber()
  @IsInt()
  @Min(1)
  @Max(65535)
  port!: number;

  @Expose({ name: 'REDIS_QUEUE_PASSWORD' })
  @IsOptional()
  @IsString()
  password?: string;
}

export default registerAs('redis-queue', () => validateConfig(RedisQueueConfig));
