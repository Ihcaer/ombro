import { Module } from '@nestjs/common';
import { SeedModule } from './seed/seed.module.js';
import { ConfigModule } from '@nestjs/config';
import { getConfigOptions } from '@core/config/env-config-options.js';

@Module({
  imports: [ConfigModule.forRoot(getConfigOptions()), SeedModule],
})
export class CliModule {}
