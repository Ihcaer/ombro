import { Module, Provider } from '@nestjs/common';
import { EmailService } from './services/email/email.service.js';
import { ConfigModule } from '@nestjs/config';
import serverConfig from '@core/config/envs/server.config.js';
import emailConfig from '@core/config/envs/email.config.js';
import { BullModule } from '@nestjs/bullmq';
import { NOTIFICATIONS_QUEUE } from './notifications.constants.js';
import { AdminPasswordResetRequestListener } from './listeners/admin-password-reset-request.listener.js';
import { AdminCreatedListener } from './listeners/admin-created.listener.js';
import { CtaUrlService } from './services/cta-url-builder/cta-url.service.js';
import { AdminPasswordResetRequestEmailHandler } from './consumers/handlers/email/auth/admin-password-reset-request-email.handler.js';
import { AdminCreationConfirmationEmailHandler } from './consumers/handlers/email/auth/admin-creation-confirmation-email.handler.js';
import { EmailConsumer } from './consumers/email.consumer.js';
import metadataConfig from '@core/config/envs/metadata.config.js';

const LISTENERS: Provider[] = [AdminPasswordResetRequestListener, AdminCreatedListener] as const;
const CONSUMERS: Provider[] = [EmailConsumer] as const;
const HANDLERS: Provider[] = [
  AdminPasswordResetRequestEmailHandler,
  AdminCreationConfirmationEmailHandler,
] as const;
const SERVICES: Provider[] = [EmailService, CtaUrlService] as const;

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
