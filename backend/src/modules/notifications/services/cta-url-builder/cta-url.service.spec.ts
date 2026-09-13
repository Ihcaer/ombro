import { Test, TestingModule } from '@nestjs/testing';
import { CtaUrlService } from './cta-url.service';
import metadataConfig from '@core/config/envs/metadata.config';
import serverConfig from '@core/config/envs/server.config';
import { createMetadataConfigMock } from '@mocks/config/metadata.config.mock';
import { createServerConfigMock } from '@mocks/config/server.config.mock';

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
