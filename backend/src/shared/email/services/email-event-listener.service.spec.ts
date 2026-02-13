import { Test, TestingModule } from '@nestjs/testing';
import { EmailEventListenerService } from './email-event-listener.service';
import serverConfig from '@core/config/envs/server.config';
import { createServerConfigMock } from '@mocks/config/server.config.mock';
import metadataConfig from '@core/config/envs/metadata.config';
import { createMetadataConfigMock } from '@mocks/config/metadata.config.mock';
import { EmailService } from './email.service';

describe('EmailEventListenerService', () => {
  let service: EmailEventListenerService;
  // let emailService: jest.Mocked<EmailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailEventListenerService,
        { provide: serverConfig.KEY, useValue: createServerConfigMock() },
        { provide: metadataConfig.KEY, useValue: createMetadataConfigMock() },
        { provide: EmailService, useValue: { sendEmail: jest.fn() } },
      ],
    }).compile();

    service = module.get<EmailEventListenerService>(EmailEventListenerService);
    // emailService = module.get(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
