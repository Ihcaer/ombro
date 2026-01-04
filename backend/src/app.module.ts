import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import enabledModules from './config/feature-flags.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Environment } from '@config/server.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === Environment.Production,
      envFilePath: '.env.local',
      cache: true,
    }),
    EventEmitterModule.forRoot({ maxListeners: 3 }),
    ...enabledModules,
  ],
})
export class AppModule {}
