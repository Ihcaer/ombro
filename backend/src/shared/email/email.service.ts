import { Inject, Injectable } from '@nestjs/common';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { EmailOptions } from './templates/emailBase';
import { OnEvent } from '@nestjs/event-emitter';
import { AdminAccountActivationTemplate } from './templates/auth/adminCreation.template';
import type { ConfigType } from '@nestjs/config';
import emailConfig from '@core/config/email.config';
import metadataConfig from '@core/config/metadata.config';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(
    @Inject(emailConfig.KEY)
    private emailConf: ConfigType<typeof emailConfig>,
    @Inject(metadataConfig.KEY)
    private metadataConf: ConfigType<typeof metadataConfig>,
  ) {
    this.transporter = createTransport({
      host: emailConf.host,
      port: emailConf.port,
      secure: emailConf.isSecure,
      auth: {
        user: emailConf.sender,
        pass: emailConf.password,
      },
    });
  }

  @OnEvent('admin.created', { async: true })
  private async sendAdminCreationConfirm(
    slug: string,
    newAdminData: { name: string; email: string },
  ): Promise<void> {
    const adminCreationEmail = new AdminAccountActivationTemplate(
      newAdminData.name,
      slug,
      this.metadataConf.mainDomain,
      this.metadataConf.mediaDomain,
      'https',
    );
    await this.sendEmail(
      adminCreationEmail.getEmailContent(),
      newAdminData.email,
    );
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
