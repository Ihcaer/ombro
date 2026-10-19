import { Test, TestingModule } from '@nestjs/testing';
import { AdminDataService } from './admin-data.service.js';
import { PrismaService } from '@core/database/prisma/prisma.service.js';

const prismaMock = { authAdmin: { findUniqueOrThrow: vi.fn() } };

describe('AdminDataService', () => {
  let service: AdminDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminDataService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    service = module.get<AdminDataService>(AdminDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
