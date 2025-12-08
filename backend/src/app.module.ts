import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import enabledModules from './config/feature-flags.config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      envFilePath: '.env.local',
    }),
    EventEmitterModule.forRoot({ maxListeners: 3 }),
    ...enabledModules,
  ],
})
export class AppModule {}
