import { validateConfig } from '@core/config/env-config.validator';
import { RedisQueueConfig } from '@core/config/envs/redis-queue.config';
import Redis from 'ioredis';

export const checkRedisQueue = async (): Promise<void> => {
  const config = validateConfig(RedisQueueConfig);

  const redis = new Redis({
    host: config.host,
    port: config.port,
    password: config.password,
    connectTimeout: 3000,
    maxRetriesPerRequest: 1,
  });

  try {
    await redis.ping();
  } catch (error) {
    throw new Error('Redis Queue is unavailable. Application cannot start.', {
      cause: error,
    });
  } finally {
    redis.disconnect();
  }
};
