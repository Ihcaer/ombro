import { AdminCreatedEvent } from '@core/auth/events/admin-created.event';
import metadataConfig from '@core/config/envs/metadata.config';
import serverConfig, { Environment } from '@core/config/envs/server.config';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { AdminAccountActivationTemplate } from '../templates/auth/admin-account-activation.template';
import { EmailService } from './email.service';
import { PasswordResetRequestEvent } from '@core/auth/events/password-reset-request.event';
import { AdminPasswordResetTemplate } from '../templates/auth/admin-password-reset.template';
import { AUTH_SLUGS } from '../frontend-paths.constants';

@Injectable()
export class EmailEventListenerService {
  private readonly protocol: 'http' | 'https';
  private readonly mediaDomain: string;

  constructor(
    @Inject(serverConfig.KEY)
    private serverConf: ConfigType<typeof serverConfig>,
    @Inject(metadataConfig.KEY)
    private metadataConf: ConfigType<typeof metadataConfig>,
    private emailService: EmailService,
  ) {
    this.protocol = serverConf.nodeEnv === Environment.Production ? 'https' : 'http';
    this.mediaDomain = metadataConf.mediaDomain;
  }

  @OnEvent(AdminCreatedEvent.EVENT_NAME, { async: true })
  private async sendAdminCreationConfirmation(payload: AdminCreatedEvent): Promise<void> {
    const registrationUrl = this.createCtaLink(
      AUTH_SLUGS.REGISTRATION,
      payload.accountConfirmationToken,
    );
    const mediaUrl = `${this.protocol}://${this.metadataConf.mediaDomain}`;

    const adminCreationEmail = new AdminAccountActivationTemplate(
      payload.newAdminData.name,
      registrationUrl,
      mediaUrl,
    );

    await this.emailService.sendEmail(
      adminCreationEmail.getEmailContent(),
      payload.newAdminData.email,
    );
  }

  @OnEvent(PasswordResetRequestEvent.EVENT_NAME, { async: true })
  private async sendAdminPasswordReset(payload: PasswordResetRequestEvent): Promise<void> {
    const passwordResetLink = this.createCtaLink(
      AUTH_SLUGS.PASSWORD_RESET,
      payload.tokenData.token,
    );

    const passwordResetEmail = new AdminPasswordResetTemplate(
      payload.adminData.name,
      passwordResetLink,
      this.mediaDomain,
      payload.tokenData.expirationTimeMinutes,
    );

    await this.emailService.sendEmail(
      passwordResetEmail.getEmailContent(),
      payload.adminData.email,
    );
  }

  private createCtaLink(slug: string, token?: string): string {
    const baseUrl: string = `${this.protocol}://${this.metadataConf.mainDomain}/${slug}`;
    return token ? `${baseUrl}/${token}` : baseUrl;
  }
}
