import { Module } from '@nestjs/common';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { getConfigOptions } from '@core/config/env-config-options';

@Module({
  imports: [ConfigModule.forRoot(getConfigOptions()), SeedModule],
})
export class CliModule {}
