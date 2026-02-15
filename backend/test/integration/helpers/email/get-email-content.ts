import { MailpitDetail } from './email.types';

export const getEmailContent = async (
  mailpitApi: string,
  emailId: string,
): Promise<MailpitDetail> => {
  const res = await fetch(`${mailpitApi}/message/${emailId}`);
  return (await res.json()) as MailpitDetail;
};
