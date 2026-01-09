import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Environment } from '@core/config/server.config';
import enabledModules from '@core/config/feature-flags.config';
import { getEnvPath } from '@core/config/get-env-path.util';

const nodeEnv =
  (process.env.NODE_ENV as Environment) || Environment.Development;

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: nodeEnv === Environment.Production,
      envFilePath: getEnvPath(),
      cache: nodeEnv !== Environment.Test,
    }),
    EventEmitterModule.forRoot({ maxListeners: 3 }),
    ...enabledModules,
  ],
})
export class AppModule {}
