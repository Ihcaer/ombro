import { EmailBase, EmailOptions, EmailTemplateContent } from '../emailBase';

export class AdminAccountActivationTemplate extends EmailBase {
  protected options: EmailOptions;
  protected content: EmailTemplateContent;
  static REGISTRATION_SLUG = 'confirm-account';

  private adminCreationContent: string = ``;

  constructor(
    private name: string,
    private confirmAccountLink: string,
    private mediaDomain: string,
  ) {
    super();

    this.setOptions();
    this.setContent(mediaDomain, name, confirmAccountLink);
  }

  private setOptions(): void {
    this.options = { subject: 'Potwierdź rejestrację w Skema Admin Panel' };
  }

  private setContent(mediaDomain: string, name: string, ctaLink: string): void {
    this.content = {
      image: {
        src: mediaDomain + '/public-assets/email/welcome.jpg',
        alt: 'Ilustracja przedstawiająca kobietę siedzącą na parapecie okna, obok kubka kawy i drzewa, symbolizująca powitanie.',
      },
      header: `Cześć ${name},`,
      content: this.adminCreationContent,
      cta: { href: ctaLink, content: 'Aktywuj konto' },
    };
  }
}
