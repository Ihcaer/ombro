import { Module, Provider } from '@nestjs/common';
import { EmailService } from './services/email/email.service';
import { ConfigModule } from '@nestjs/config';
import serverConfig from '@core/config/envs/server.config';
import emailConfig from '@core/config/envs/email.config';
import { BullModule } from '@nestjs/bullmq';
import { NOTIFICATIONS_QUEUE } from './notifications.constants';
import { AdminPasswordResetRequestListener } from './listeners/admin-password-reset-request.listener';
import { AdminCreatedListener } from './listeners/admin-created.listener';
import { CtaUrlService } from './services/cta-url-builder/cta-url.service';
import { AdminPasswordResetRequestEmailHandler } from './consumers/handlers/email/auth/admin-password-reset-request-email.handler';
import { AdminCreationConfirmationEmailHandler } from './consumers/handlers/email/auth/admin-creation-confirmation-email.handler';
import { EmailConsumer } from './consumers/email.consumer';
import metadataConfig from '@core/config/envs/metadata.config';

const LISTENERS: Provider[] = [AdminPasswordResetRequestListener, AdminCreatedListener];
const CONSUMERS: Provider[] = [EmailConsumer];
const HANDLERS: Provider[] = [
  AdminPasswordResetRequestEmailHandler,
  AdminCreationConfirmationEmailHandler,
];
const SERVICES: Provider[] = [EmailService, CtaUrlService];

@Module({
  imports: [
    BullModule.registerQueue({ name: NOTIFICATIONS_QUEUE }),
    ConfigModule.forFeature(emailConfig),
    ConfigModule.forFeature(serverConfig),
    ConfigModule.forFeature(metadataConfig),
  ],
  providers: [...LISTENERS, ...CONSUMERS, ...HANDLERS, ...SERVICES],
})
export class NotificationsModule {}
