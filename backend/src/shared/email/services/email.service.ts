import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { EmailOptions } from '../templates/emailBase';
import type { ConfigType } from '@nestjs/config';
import emailConfig from '@core/config/envs/email.config';
import { setTimeout } from 'node:timers/promises';
import serverConfig, { Environment } from '@core/config/envs/server.config';

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
    const maxRetries = 3;
    const baseDelayMs = 1000;

    const mailOptions: SendMailOptions = {
      from: `"${fromName}" ${this.emailConf.sender}`,
      to: recipient,
      subject: template.subject,
      html: template.html,
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.transporter.sendMail(mailOptions);
        return;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        if (attempt === maxRetries) {
          this.logger.error(
            `Failed to send email to ${recipient} with subject ${mailOptions.subject}. Reason: ${errorMessage}`,
          );
          break;
        }

        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        this.logger.warn(
          `Attempt ${attempt}/${maxRetries} to send email failed: ${errorMessage}. Retrying in ${delay}ms...`,
        );
        await setTimeout(delay);
      }
    }
  }
}
