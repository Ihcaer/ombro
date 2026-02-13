import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './services/email.service';
import { EmailEventListenerService } from './services/email-event-listener.service';
import emailConfig from '@core/config/envs/email.config';
import metadataConfig from '@core/config/envs/metadata.config';
import serverConfig from '@core/config/envs/server.config';

@Module({
  imports: [
    ConfigModule.forFeature(serverConfig),
    ConfigModule.forFeature(emailConfig),
    ConfigModule.forFeature(metadataConfig),
  ],
  providers: [EmailService, EmailEventListenerService],
})
export class EmailModule {}
