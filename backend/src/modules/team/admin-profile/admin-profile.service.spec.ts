import { Test, TestingModule } from '@nestjs/testing';
import { AdminProfileService } from './admin-profile.service.js';
import { AdminDataService } from '@core/auth/services/admin-data/admin-data.service.js';

describe('AdminProfileService', () => {
  let service: AdminProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminProfileService,
        {
          provide: AdminDataService,
          useValue: { getSelfAdmin: vi.fn(), getAdminData: vi.fn() },
        },
      ],
    }).compile();

    service = module.get<AdminProfileService>(AdminProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
