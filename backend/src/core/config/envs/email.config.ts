import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { IsBoolean, IsDefined, IsEmail, IsNotEmpty, IsPort, IsString } from 'class-validator';
import { validateConfig } from '../env-config.validator';
import { ToBoolean } from '@shared/decorators/type-transformation.decorators';

export class EmailConfig {
  @Expose({ name: 'EMAIL_HOST' })
  @IsString()
  @IsNotEmpty()
  host!: string;

  @Expose({ name: 'EMAIL_PORT' })
  @IsPort()
  port!: string;

  @Expose({ name: 'EMAIL_IS_SECURE' })
  @IsDefined()
  @ToBoolean()
  @IsBoolean()
  isSecure!: boolean;

  @Expose({ name: 'EMAIL_SENDER' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  sender!: string;

  @Expose({ name: 'EMAIL_PASSWORD' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @Expose({ name: 'EMAIL_RECIPIENT' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  recipient!: string;
}

export default registerAs('email', () => validateConfig(EmailConfig));
