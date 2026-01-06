import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import emailConfig from '@core/config/email.config';
import metadataConfig from '@core/config/metadata.config';
import { createEmailConfigMock } from '@mocks/config/email.config.mock';
import { createMetadataConfigMock } from '@mocks/config/metadata.config.mock';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: emailConfig.KEY, useValue: createEmailConfigMock() },
        { provide: metadataConfig.KEY, useValue: createMetadataConfigMock() },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
