export interface EmailOptions {
  from?: string;
  subject: string;
}

export interface EmailTemplateContent {
  image?: {
    src: string;
    alt: string;
  };
  header: string;
  content: string;
  cta?: {
    href: string;
    content: string;
  };
  additional?: string;
}

export abstract class EmailBase {
  protected abstract options: EmailOptions;
  protected abstract content: EmailTemplateContent;

  getEmailContent(): EmailOptions & { html: string } {
    return { ...this.options, html: this.getTemplate() };
  }

  private getTemplate(): string {
    const img: string = `<tr><td style="text-align: center">
         <img src="${this.content.image?.src}" alt="${this.content.image?.alt}" style="height: 144px; width: auto"/>
      </td></tr>`;
    const image: string = this.content.image ? img : '';

    const ctaButton: string = `<tr><td style="text-align: center">
         <a href="${this.content.cta?.href}" style=" background-color: #5191dc; color: #dde6f9; border-radius: 8px; padding: 8px 16px;">${this.content.cta?.content}</a>
      </td></tr>`;
    const cta: string = this.content.cta ? ctaButton : '';

    const additional: string = this.content.additional
      ? `<tr><td>${this.content.additional}<td/><tr/>`
      : '';

    const template: string = `
      <!DOCTYPE html>
      <html lang="pl">
         <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${this.options.subject}</title>
            <style>
               @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&family=Roboto:wght@400..700&display=swap');
            </style>
         </head>
         <body style="margin: 0; color: #000; background-color: #b2b4b8; font-family: 'Roboto', Arial, sans-serif;">
            <table width="100%">
               <tr>
                  <td style="text-align: center">
                     <table style="border-collapse: collapse; margin: 0 auto; width: 100%; max-width: 600px; padding: 10px 15px;">
                        <!-- logo -->
                        <tr>
                           <td style="font-size: 20px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #bfbcbc; background-color: #132943; padding: 12px 0;border-radius: 12px 12px 0 0;">
                              ADMIN PANEL
                           </td>
                        </tr>
                        <tr>
                           <td style="background-color: #fff; padding: 16px">
                              <!-- content -->
                              <table style="text-align: start; width: 100%">
                                 <!-- image -->
                                 ${image}
                                 <!-- text -->
                                 <tr>
                                    <td>
                                       <table style="width: 100%; border-collapse: separate; border-spacing: 0 8px">
                                          <tr>
                                             <td style="font-size: 18px; font-weight: 700; margin-bottom: 8px">
                                                ${this.content.header}
                                             </td>
                                          </tr>
                                          <tr>
                                             <td style="font-size: 16px">${this.content.content}</td>
                                          </tr>
                                       </table>
                                    </td>
                                 </tr>
                                 <!-- cta button -->
                                 ${cta}
                                 <!-- additional -->
                                 ${additional}
                              </table>
                              <!-- end of content -->
                           </td>
                        </tr>
                        <tr>
                           <td tyle="border-radius: 0 0 12px 12px; color: #dadbdd; background-color: #132943; padding: 12px 0;">
                              Wiadomość wysłana automatycznie. Prosimy na nią nie odpowiadać.
                           </td>
                        </tr>
                     </table>
                  </td>
               </tr>
            </table>
         </body>
      </html>
   `;
    return template;
  }
}
