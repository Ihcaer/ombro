import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsPort,
  IsString,
} from 'class-validator';
import { validateConfig } from '../env-config.validator';

export class EmailConfig {
  @Expose({ name: 'EMAIL_HOST' })
  @IsString()
  @IsNotEmpty()
  host: string;

  @Expose({ name: 'EMAIL_PORT' })
  @IsPort()
  port: string;

  @Expose({ name: 'EMAIL_IS_SECURE' })
  @IsBoolean()
  @IsNotEmpty()
  isSecure: boolean;

  @Expose({ name: 'EMAIL_SENDER' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  sender: string;

  @Expose({ name: 'EMAIL_PASSWORD' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Expose({ name: 'EMAIL_RECIPIENT' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  recipient: string;
}

export default registerAs('email', () => validateConfig(EmailConfig));
