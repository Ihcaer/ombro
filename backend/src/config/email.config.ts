import { registerAs } from '@nestjs/config';

export interface EmailConfig {
  host: string;
  port: number;
  isSecure: boolean;
  sender: string;
  password: string;
  recipient: string;
}

export default registerAs('email', () => ({
  host: process.env.EMAIL_HOST as string,
  port: Number(process.env.EMAIL_PORT),
  isSecure: process.env.IS_SECURE === 'true',
  sender: process.env.EMAIL_SENDER as string,
  password: process.env.EMAIL_PASSWORD as string,
  recipient: process.env.EMAIL_RECIPIENT as string,
}));
