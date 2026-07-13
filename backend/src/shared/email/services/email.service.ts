import { Inject, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { EmailOptions } from '../templates/emailBase';
import type { ConfigType } from '@nestjs/config';
import emailConfig from '@core/config/envs/email.config';
import { setTimeout } from 'node:timers/promises';
import serverConfig, { Environment } from '@core/config/envs/server.config';

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: Transporter;

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
      console.log('Connection to the SMTP server has been confirmed.');
    } catch (error) {
      console.error('SMTP connection error:', error);
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
}
