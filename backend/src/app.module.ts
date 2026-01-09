import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Environment } from '@core/config/server.config';
import enabledModules from '@core/config/feature-flags.config';
import { getEnvPath } from '@core/config/get-env-path.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === Environment.Production,
      envFilePath: getEnvPath(),
      cache: true,
    }),
    EventEmitterModule.forRoot({ maxListeners: 3 }),
    ...enabledModules,
  ],
})
export class AppModule {}
