import { registerAs } from '@nestjs/config';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsEmail, IsNotEmpty, IsPort, IsString } from 'class-validator';
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
  @Transform(
    ({ obj }: { obj: Record<string, string | undefined> }) => {
      const value = obj.EMAIL_IS_SECURE;

      if (value === 'true') {
        return true;
      } else if (value === 'false') {
        return false;
      } else {
        return undefined;
      }
    },
    { toClassOnly: true },
  )
  @IsDefined()
  @IsBoolean()
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
