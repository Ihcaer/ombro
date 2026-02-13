import { EmailBase, EmailOptions, EmailTemplateContent } from '../emailBase';

export class PasswordResetTemplate extends EmailBase {
  protected options: EmailOptions;
  protected content: EmailTemplateContent;
  protected mediaDomain: string;
  static PASSWORD_RESET_SLUG = 'password-reset';
  private static EXPIRATION_TIME_PLACEHOLDER: string = '{{expiration-time}}';
  private passwordResetContent: string = `Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta w Admin Panel. Możesz je teraz zmienić klikając poniższy przycisk. Link wygaśnie w ciągu ${PasswordResetTemplate.EXPIRATION_TIME_PLACEHOLDER}.`;
  private additionalContent: string =
    'Jeśli to nie Ty poprosiłeś/aś o zresetowanie hasła, zignoruj tę wiadomość. Twoje hasło pozostanie bez zmian.';

  constructor(
    private name: string,
    private passwordResetLink: string,
    private inputMediaDomain: string,
    private expirationTimeMinutes: number,
  ) {
    super();

    this.mediaDomain = inputMediaDomain;
    this.passwordResetContent.replace(
      PasswordResetTemplate.EXPIRATION_TIME_PLACEHOLDER,
      `${expirationTimeMinutes} minut`,
    );

    this.setOptions();
    this.setContent(name, passwordResetLink);
  }

  private setOptions(): void {
    this.options = { subject: 'Resetowanie hasła w Skema Admin Panel' };
  }

  private setContent(name: string, ctaLink: string): void {
    this.content = {
      image: {
        src: this.mediaDomain + '/public-assets/email/authentication.jpg',
        alt: 'Ilustracja przedstawiająca proces weryfikacji i bezpieczeństwa konta',
      },
      header: `Cześć ${name},`,
      content: this.passwordResetContent,
      cta: { href: ctaLink, content: 'Zmień hasło' },
      additional: this.additionalContent,
    };
  }
}
