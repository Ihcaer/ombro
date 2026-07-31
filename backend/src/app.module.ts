import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import enabledModules from '@core/config/feature-flags.config';
import { getConfigOptions } from '@core/config/env-config-options';
import { BullModule } from '@nestjs/bullmq';
import redisQueueConfig from '@core/config/envs/redis-queue.config';

@Module({
  imports: [
    ConfigModule.forRoot(getConfigOptions()),
    EventEmitterModule.forRoot({ maxListeners: 3, delimiter: '.' }),
    BullModule.forRootAsync({
      imports: [ConfigModule.forFeature(redisQueueConfig)],
      inject: [redisQueueConfig.KEY],
      useFactory: (config: ConfigType<typeof redisQueueConfig>) => ({
        connection: { host: config.host, port: config.port, password: config.password },
      }),
    }),
    ...enabledModules,
  ],
})
export class AppModule {}
