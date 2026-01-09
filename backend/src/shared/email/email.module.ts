import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import emailConfig from '@core/config/envs/email.config';
import metadataConfig from '@core/config/envs/metadata.config';

@Module({
  imports: [
    ConfigModule.forFeature(emailConfig),
    ConfigModule.forFeature(metadataConfig),
  ],
  providers: [EmailService],
})
export class EmailModule {}
