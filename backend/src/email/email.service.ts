import { EmailConfig } from '@config/email.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { EmailOptions } from './templates/emailBase';
import { OnEvent } from '@nestjs/event-emitter';
import { AdminAccountActivationTemplate } from './templates/auth/adminCreation.template';
import { MetadataConfig } from '@config/metadata.config';

@Injectable()
export class EmailService {
  private emailConfig: EmailConfig;
  private metadataConfig: MetadataConfig;
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.emailConfig = this.configService.get<EmailConfig>('email', {
      infer: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.metadataConfig = this.configService.get<MetadataConfig>('metadata', {
      infer: true,
    });

    this.transporter = createTransport({
      host: this.emailConfig.host,
      port: this.emailConfig.port,
      secure: this.emailConfig.isSecure,
      auth: {
        user: this.emailConfig.sender,
        pass: this.emailConfig.password,
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
      this.metadataConfig.mainDomain,
      this.metadataConfig.mediaDomain,
      'https',
    );
    await this.sendEmail(
      adminCreationEmail.getEmailContent(),
      newAdminData.email,
    );
  }

  private async sendEmail(
    template: EmailOptions & { html: string },
    recipient: string = this.emailConfig.recipient,
  ): Promise<void> {
    const defaultFromName = 'Skema Admin Panel';
    const fromName: string = template.from ?? defaultFromName;

    const mailOptions: SendMailOptions = {
      from: `"${fromName}" ${this.emailConfig.sender}`,
      to: recipient,
      subject: template.subject,
      html: template.html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
