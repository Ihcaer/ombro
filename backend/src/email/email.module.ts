import emailConfig from '@app/config/email.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import metadataConfig from '@config/metadata.config';

@Module({
  imports: [
    ConfigModule.forFeature(emailConfig),
    ConfigModule.forFeature(metadataConfig),
  ],
  providers: [EmailService],
})
export class EmailModule {}
