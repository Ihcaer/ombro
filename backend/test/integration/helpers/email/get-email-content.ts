import { MailpitDetail } from './email.types';
import { mailpitConfig } from './mailpit.config';

export const getEmailContent = async (emailId: string): Promise<MailpitDetail> => {
  const res = await fetch(`${mailpitConfig.mailpitApi}/message/${emailId}`);
  return (await res.json()) as MailpitDetail;
};
