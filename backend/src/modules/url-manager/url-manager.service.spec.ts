import { Test, TestingModule } from '@nestjs/testing';
import { UrlManagerService } from './url-manager.service.js';
import { PrismaService } from '@core/database/prisma/prisma.service.js';

describe('UrlManagerService', () => {
  let service: UrlManagerService;

  const mockPrismaService = {
    urlManagerRedirect: {
      upsert: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlManagerService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<UrlManagerService>(UrlManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
