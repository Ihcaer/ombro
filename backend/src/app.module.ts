import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import enabledModules from '@core/config/feature-flags.config';
import { getConfigOptions } from '@core/config/env-config-options';

@Module({
  imports: [
    ConfigModule.forRoot(getConfigOptions()),
    EventEmitterModule.forRoot({ maxListeners: 3, delimiter: '.' }),
    ...enabledModules,
  ],
})
export class AppModule {}
