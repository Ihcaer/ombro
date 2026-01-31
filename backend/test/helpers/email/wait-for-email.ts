import { setTimeout } from 'node:timers/promises';
import { MailpitMessage, MailpitResponse } from './email.types';
import { mailpitConfig } from './mailpit.config';

export async function waitForEmail(
  emailData: { recipient: string; subject: string },
  retries: number = 5,
  delay: number = 1000,
): Promise<MailpitMessage> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(mailpitConfig.mailpitApi + '/messages');
    const data = (await response.json()) as MailpitResponse;

    const email = data.messages.find(
      (message) =>
        message.To[0].Address === emailData.recipient &&
        message.Subject.includes(emailData.subject),
    );

    if (email) return email;

    await setTimeout(delay * Math.pow(2, i - 1));
  }

  throw new Error(`Email to ${emailData.recipient} with subject "${emailData.subject}" not found`);
}
