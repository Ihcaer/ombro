import { EmailBase, EmailOptions, EmailTemplateContent } from '../emailBase';

export class AdminAccountActivationTemplate extends EmailBase {
  protected options: EmailOptions;
  protected content: EmailTemplateContent;
  private readonly confirmAccountLink: string;

  constructor(
    private name: string,
    private slug: string,
    private domain: string = 'localhost',
    private mediaDomain: string = 'localhost',
    private protocol: 'http' | 'https' = 'https',
  ) {
    super();
    this.confirmAccountLink = `${protocol}://${domain}/${slug}`;
    this.setOptions();
    this.setContent(
      `${protocol}://${mediaDomain}`,
      name,
      this.confirmAccountLink,
    );
  }

  private setOptions(): void {
    this.options = { subject: 'Potwierdzenie rejestracji w Skema Admin Panel' };
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

  private adminCreationContent: string = ``;
}
