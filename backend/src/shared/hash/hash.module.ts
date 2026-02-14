import { Module } from '@nestjs/common';
import { HashService } from './hash.service';
import { ConfigModule } from '@nestjs/config';
import securityConfig from '@core/config/envs/security.config';

@Module({
  imports: [ConfigModule.forFeature(securityConfig)],
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}
