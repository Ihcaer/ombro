import { Test, TestingModule } from '@nestjs/testing';
import { CtaUrlService } from './cta-url.service.js';
import metadataConfig from '@core/config/envs/metadata.config.js';
import serverConfig from '@core/config/envs/server.config.js';
import { createMetadataConfigMock } from '@mocks/config/metadata.config.mock.js';
import { createServerConfigMock } from '@mocks/config/server.config.mock.js';

describe('CtaUrlService', () => {
  let service: CtaUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CtaUrlService,
        { provide: serverConfig.KEY, useValue: createServerConfigMock() },
        { provide: metadataConfig.KEY, useValue: createMetadataConfigMock() },
      ],
    }).compile();

    service = module.get<CtaUrlService>(CtaUrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
