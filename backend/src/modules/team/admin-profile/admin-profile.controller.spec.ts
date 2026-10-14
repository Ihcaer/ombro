import { Test, TestingModule } from '@nestjs/testing';
import { AdminProfileController } from './admin-profile.controller.js';
import { AdminProfileService } from './admin-profile.service.js';
// import { Mocked } from 'vitest';

describe('AdminProfileController', () => {
  let controller: AdminProfileController;
  // let adminProfileService: Mocked<AdminProfileService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminProfileController],
      providers: [
        {
          provide: AdminProfileService,
          useValue: { adminOwnProfileData: vi.fn(), adminProfileData: vi.fn() },
        },
      ],
    }).compile();

    controller = module.get<AdminProfileController>(AdminProfileController);
    // adminProfileService = module.get(AdminProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
