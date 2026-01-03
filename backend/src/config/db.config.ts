import { registerAs } from '@nestjs/config';

export interface DbConfig {
  url: string;
}

export default registerAs('db', () => ({
  url: process.env.POSTGRES_URL as string,
}));
