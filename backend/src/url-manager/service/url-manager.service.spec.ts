import { Test, TestingModule } from '@nestjs/testing';
import { UrlManagerService } from './url-manager.service';
import { PrismaService } from '@app-prisma/prisma.service';

describe('UrlManagerService', () => {
  let service: UrlManagerService;

  const mockPrismaService = {
    urlManagerRedirect: {
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlManagerService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UrlManagerService>(UrlManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
