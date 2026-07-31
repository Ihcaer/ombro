import { EmailBase, EmailOptions, EmailTemplateContent } from '../email-base';

export class AdminAccountActivationTemplate extends EmailBase {
  protected options: EmailOptions;
  protected content: EmailTemplateContent;
  protected mediaDomain: string;
  private adminCreationContent: string = `Administrator systemu <b>Admin Panel</b> utworzył dla Ciebie konto. Możesz je teraz aktywować i ustawić swoje hasło poprzez kliknięcie przycisku poniżej. Link wygaśnie w ciągu 24 godzin.`;

  constructor(
    private adminName: string,
    private confirmAccountLink: string,
    private inputMediaDomain: string,
  ) {
    super();

    this.mediaDomain = inputMediaDomain;
    this.options = this.setOptions();
    this.content = this.setContent(adminName, confirmAccountLink);
  }

  private setOptions(): EmailOptions {
    return { subject: 'Potwierdź rejestrację w Skema Admin Panel' };
  }

  private setContent(name: string, ctaLink: string): EmailTemplateContent {
    return {
      image: {
        src: this.mediaDomain + '/public-assets/email/welcome.jpg',
        alt: 'Ilustracja przedstawiająca kobietę siedzącą na parapecie okna, obok kubka kawy i drzewa, symbolizująca powitanie.',
      },
      header: `Cześć ${name},`,
      content: this.adminCreationContent,
      cta: { href: ctaLink, content: 'Aktywuj konto' },
    };
  }
}
