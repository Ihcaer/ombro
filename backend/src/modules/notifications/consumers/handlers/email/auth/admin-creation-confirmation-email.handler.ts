import { Injectable } from '@nestjs/common';
import { AdminCreatedPayload } from '@core/auth/events/admin-created.event';
import { EmailService } from '@modules/notifications/services/email/email.service';
import { CtaUrlService } from '@modules/notifications/services/cta-url-builder/cta-url.service';
import { Job } from 'bullmq';
import { AUTH_SLUGS } from '@modules/notifications/frontend-paths.constants';
import { AdminAccountActivationTemplate } from '@modules/notifications/emails/auth/admin-account-activation.template';
import { IJobHandler } from '../../handler.interface';

@Injectable()
export class AdminCreationConfirmationEmailHandler implements IJobHandler<AdminCreatedPayload> {
  constructor(
    private readonly emailService: EmailService,
    private readonly ctaService: CtaUrlService,
  ) {}

  async handle(data: AdminCreatedPayload, _job?: Job): Promise<void> {
    const { accountConfirmationToken, newAdminData } = data;

    const registrationUrl = this.ctaService.createCtaLink(
      AUTH_SLUGS.REGISTRATION,
      accountConfirmationToken,
    );

    const adminCreationEmail = new AdminAccountActivationTemplate(
      newAdminData.name,
      registrationUrl,
      this.ctaService.mediaDomain,
    );

    await this.emailService.sendEmail(adminCreationEmail.getEmailContent(), newAdminData.email);
  }
}
