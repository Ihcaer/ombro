import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { createEmailConfigMock } from '@mocks/config/email.config.mock';
import emailConfig from '@core/config/envs/email.config';
import serverConfig from '@core/config/envs/server.config';
import { createServerConfigMock } from '@mocks/config/server.config.mock';

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
