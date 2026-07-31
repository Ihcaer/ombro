import { Injectable } from '@nestjs/common';
import { IJobHandler } from '../../handler.interface';
import { AdminPasswordResetRequestPayload } from '@core/auth/events/admin-password-reset-request.event';
import { EmailService } from '@modules/notifications/services/email/email.service';
import { Job } from 'bullmq';
import { AUTH_SLUGS } from '@modules/notifications/frontend-paths.constants';
import { AdminPasswordResetTemplate } from '@modules/notifications/emails/auth/admin-password-reset.template';
import { CtaUrlService } from '@modules/notifications/services/cta-url-builder/cta-url.service';

@Injectable()
export class AdminPasswordResetRequestEmailHandler implements IJobHandler<AdminPasswordResetRequestPayload> {
  constructor(
    private readonly emailService: EmailService,
    private readonly ctaService: CtaUrlService,
  ) {}

  async handle(data: AdminPasswordResetRequestPayload, _job?: Job): Promise<void> {
    const { adminData, tokenData } = data;

    const passwordResetLink = this.ctaService.createCtaLink(
      AUTH_SLUGS.PASSWORD_RESET,
      tokenData.token,
    );

    const passwordResetEmail = new AdminPasswordResetTemplate(
      adminData.name,
      passwordResetLink,
      this.ctaService.mediaDomain,
      tokenData.expirationTimeMinutes,
    );

    await this.emailService.sendEmail(passwordResetEmail.getEmailContent(), adminData.email);
  }
}
