import { Inject, Injectable } from '@nestjs/common';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { EmailOptions } from './templates/emailBase';
import { OnEvent } from '@nestjs/event-emitter';
import { AdminAccountActivationTemplate } from './templates/auth/admin-creation.template';
import type { ConfigType } from '@nestjs/config';
import emailConfig from '@core/config/envs/email.config';
import metadataConfig from '@core/config/envs/metadata.config';
import { setTimeout } from 'node:timers/promises';
import serverConfig, { Environment } from '@core/config/envs/server.config';
import { AdminCreatedEvent } from '@core/auth/events/admin-created.event';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(
    @Inject(serverConfig.KEY)
    private serverConf: ConfigType<typeof serverConfig>,
    @Inject(emailConfig.KEY)
    private emailConf: ConfigType<typeof emailConfig>,
    @Inject(metadataConfig.KEY)
    private metadataConf: ConfigType<typeof metadataConfig>,
  ) {
    this.transporter = createTransport({
      host: emailConf.host,
      port: Number(emailConf.port),
      secure: emailConf.isSecure,
      auth: {
        user: emailConf.sender,
        pass: emailConf.password,
      },
    });
  }

  @OnEvent('admin.created', { async: true })
  private async sendAdminCreationConfirmation(
    payload: AdminCreatedEvent,
  ): Promise<void> {
    const { accountConfirmationToken, newAdminData } = payload;

    const maxRetries = 3;
    const baseDelayMs = 1000;
    const protocol: 'http' | 'https' =
      this.serverConf.nodeEnv !== Environment.Production ? 'http' : 'https';

    const adminCreationEmail = new AdminAccountActivationTemplate(
      newAdminData.name,
      accountConfirmationToken,
      this.metadataConf.mainDomain,
      this.metadataConf.mediaDomain,
      protocol,
    );

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.sendEmail(
          adminCreationEmail.getEmailContent(),
          newAdminData.email,
        );
        return;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        if (attempt === maxRetries) {
          console.error('Email cannot be sended:', error);
          break;
        }

        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        console.warn(
          `Attempt ${attempt}/${maxRetries} to send email failed: ${errorMessage}. Retrying in ${delay}ms...`,
        );
        await setTimeout(delay);
      }
    }
  }

  private async sendEmail(
    template: EmailOptions & { html: string },
    recipient: string = this.emailConf.recipient,
  ): Promise<void> {
    const defaultFromName = 'Skema Admin Panel';
    const fromName: string = template.from ?? defaultFromName;

    const mailOptions: SendMailOptions = {
      from: `"${fromName}" ${this.emailConf.sender}`,
      to: recipient,
      subject: template.subject,
      html: template.html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
