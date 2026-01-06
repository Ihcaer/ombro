import { EmailConfig } from '@config/email.config';
import { plainToInstance } from 'class-transformer';

type RawEmailEnv = {
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_IS_SECURE: boolean;
  EMAIL_SENDER: string;
  EMAIL_PASSWORD: string;
  EMAIL_RECIPIENT: string;
};

export const createEmailConfigMock = (
  overrides: Partial<RawEmailEnv> = {},
): EmailConfig => {
  const defaultValues: RawEmailEnv = {
    EMAIL_HOST: 'smtp.test.com',
    EMAIL_PORT: 587,
    EMAIL_IS_SECURE: false,
    EMAIL_SENDER: 'mail@test.com',
    EMAIL_PASSWORD: 'test-password',
    EMAIL_RECIPIENT: 'mail@test.com',
  };

  return plainToInstance(EmailConfig, { ...defaultValues, ...overrides });
};
