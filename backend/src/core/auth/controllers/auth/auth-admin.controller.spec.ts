import { Test, TestingModule } from '@nestjs/testing';
import { AuthAdminController } from './auth-admin.controller.js';
import { AdminCredentialsService } from '@core/auth/services/admin-credentials/admin-credentials.service.js';

describe('AuthAdminController', () => {
  let controller: AuthAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthAdminController],
      providers: [{ provide: AdminCredentialsService, useValue: { changePassword: vi.fn() } }],
    }).compile();

    controller = module.get<AuthAdminController>(AuthAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
