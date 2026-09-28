import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { EmailOptions } from '@modules/notifications/emails/email-base.js';
import type { ConfigType } from '@nestjs/config';
import emailConfig from '@core/config/envs/email.config.js';
import serverConfig, { Environment } from '@core/config/envs/server.config.js';

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @Inject(serverConfig.KEY)
    private serverConf: ConfigType<typeof serverConfig>,
    @Inject(emailConfig.KEY)
    private emailConf: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = createTransport({
      host: emailConf.host,
      port: Number(emailConf.port),
      secure: emailConf.isSecure,
      auth: {
        user: emailConf.sender,
        pass: emailConf.password,
      },
      tls: {
        rejectUnauthorized: serverConf.nodeEnv === Environment.Production,
      },
    });
  }

  async onModuleInit() {
    try {
      await this.transporter.verify();
      this.logger.log('Connection to the SMTP server has been confirmed.');
    } catch (error) {
      const cause = error instanceof Error ? error.message : String(error);
      this.logger.error(`SMTP connection error. Reason: ${cause}`);

      if (this.serverConf.nodeEnv === Environment.Production) {
        throw new InternalServerErrorException();
      }
    }
  }

  async sendEmail(
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
