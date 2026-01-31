export type MailpitMessage = {
  ID: string;
  To: { Address: string }[];
  Subject: string;
  Created: string;
};

export type MailpitResponse = { messages: MailpitMessage[] };
