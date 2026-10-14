import { Test, TestingModule } from '@nestjs/testing';
import { AdminProfileService } from './admin-profile.service.js';
import { PrismaService } from '@core/database/prisma/prisma.service.js';

const prismaServiceMock = { authAdmin: { findUnique: vi.fn() } };
// type PrismaServiceMock = typeof prismaServiceMock;

describe('AdminProfileService', () => {
  let service: AdminProfileService;
  // let prismaService: PrismaServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminProfileService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<AdminProfileService>(AdminProfileService);
    // prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
