import emailConfig from '@app/config/email.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule.forFeature(emailConfig)],
  providers: [EmailService],
})
export class EmailModule {}
