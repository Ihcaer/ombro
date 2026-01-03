import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';

describe('EmailService', () => {
  let service: EmailService;
  // let configService: jest.Mocked<ConfigService>;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'email':
          return {
            host: 'localhost',
            port: 587,
            isSecure: false,
            sender: 'app@test.com',
            password: 'email_password',
            recipient: 'recipient@test.com',
          };
        case 'metadata':
          return { mainDomain: 'localhost', mediaDomain: 'localhost' };
        default:
          return null;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    // configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
