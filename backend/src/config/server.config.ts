import { registerAs } from '@nestjs/config';

export interface ServerConfig {
  nodeEnv: string;
  port: number;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  hashSecret: string;
}

export default registerAs('server', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.API_PORT) || 3000,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  hashSecret: process.env.HASH_SECRET,
}));
