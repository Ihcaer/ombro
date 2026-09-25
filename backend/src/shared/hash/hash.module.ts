import { Module } from '@nestjs/common';
import { HashService } from './hash.service.js';
import { ConfigModule } from '@nestjs/config';
import securityConfig from '@core/config/envs/security.config.js';

@Module({
  imports: [ConfigModule.forFeature(securityConfig)],
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}
