export type MailpitSummary = {
  ID: string;
  To: { Address: string }[];
  Subject: string;
  Created: string;
};

export type MailpitDetail = MailpitSummary & { HTML: string; Text: string; Snippet: string };

export type MailpitResponse = { messages: MailpitSummary[] };
