import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import emailConfig from '@core/config/email.config';
import metadataConfig from '@core/config/metadata.config';

@Module({
  imports: [
    ConfigModule.forFeature(emailConfig),
    ConfigModule.forFeature(metadataConfig),
  ],
  providers: [EmailService],
})
export class EmailModule {}
