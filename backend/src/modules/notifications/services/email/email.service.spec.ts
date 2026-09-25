import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service.js';
import { createEmailConfigMock } from '@mocks/config/email.config.mock.js';
import emailConfig from '@core/config/envs/email.config.js';
import serverConfig from '@core/config/envs/server.config.js';
import { createServerConfigMock } from '@mocks/config/server.config.mock.js';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: serverConfig.KEY, useValue: createServerConfigMock() },
        { provide: emailConfig.KEY, useValue: createEmailConfigMock() },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
