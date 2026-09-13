import { EmailBase, EmailOptions, EmailTemplateContent } from '../email-base';

export class AdminPasswordResetTemplate extends EmailBase {
  protected options: EmailOptions;
  protected content: EmailTemplateContent;
  protected mediaDomain: string;
  private static EXPIRATION_TIME_PLACEHOLDER: string = '{{expiration-time}}';
  private passwordResetContent: string = `Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta w Admin Panel. Możesz je teraz zmienić klikając poniższy przycisk. Link wygaśnie w ciągu ${AdminPasswordResetTemplate.EXPIRATION_TIME_PLACEHOLDER}.`;
  private additionalContent: string =
    'Jeśli to nie Ty poprosiłeś/aś o zresetowanie hasła, zignoruj tę wiadomość. Twoje hasło pozostanie bez zmian.';

  constructor(
    private adminName: string,
    private passwordResetLink: string,
    private inputMediaDomain: string,
    private expirationTimeMinutes: number,
  ) {
    super();

    this.mediaDomain = inputMediaDomain;
    this.passwordResetContent.replace(
      AdminPasswordResetTemplate.EXPIRATION_TIME_PLACEHOLDER,
      `${expirationTimeMinutes} minut`,
    );

    this.options = this.setOptions();
    this.content = this.setContent(adminName, passwordResetLink);
  }

  private setOptions(): EmailOptions {
    return { subject: 'Resetowanie hasła w Skema Admin Panel' };
  }

  private setContent(adminName: string, ctaLink: string): EmailTemplateContent {
    return {
      image: {
        src: this.mediaDomain + '/public-assets/email/authentication.jpg',
        alt: 'Ilustracja przedstawiająca proces weryfikacji i bezpieczeństwa konta',
      },
      header: `Cześć ${adminName},`,
      content: this.passwordResetContent,
      cta: { href: ctaLink, content: 'Zmień hasło' },
      additional: this.additionalContent,
    };
  }
}
