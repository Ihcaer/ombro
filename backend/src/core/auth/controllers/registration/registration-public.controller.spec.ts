import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationPublicController } from './registration-public.controller.js';
import { AdminRegistrationService } from '@core/auth/services/admin-registration/admin-registration.service.js';

describe('RegistrationPublicController', () => {
  let controller: RegistrationPublicController;
  // let adminRegistrationService: Mocked<AdminRegistrationService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationPublicController],
      providers: [
        {
          provide: AdminRegistrationService,
          useValue: {
            getFormFieldsToConfirm: vi.fn(),
            accountConfirmation: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RegistrationPublicController>(RegistrationPublicController);
    // adminRegistrationService = module.get(AdminRegistrationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
