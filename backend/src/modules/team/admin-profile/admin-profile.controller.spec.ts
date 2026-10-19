import { Test, TestingModule } from '@nestjs/testing';
import { AdminProfileController } from './admin-profile.controller.js';
import { AdminProfileService } from './admin-profile.service.js';
import { AuditLogService } from '@modules/audit/services/audit-log/audit-log.service.js';

describe('AdminProfileController', () => {
  let controller: AdminProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminProfileController],
      providers: [
        {
          provide: AdminProfileService,
          useValue: { getSelfProfile: vi.fn(), getProfile: vi.fn() },
        },
        { provide: AuditLogService, useValue: { getLogs: vi.fn() } },
      ],
    }).compile();

    controller = module.get<AdminProfileController>(AdminProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
