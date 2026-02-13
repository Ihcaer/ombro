import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationController } from './registration.controller';
import { AdminRegistrationService } from '@core/auth/services/admin-registration/admin-registration.service';

describe('RegistrationController', () => {
  let controller: RegistrationController;
  // let adminRegistrationService: jest.Mocked<AdminRegistrationService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationController],
      providers: [
        {
          provide: AdminRegistrationService,
          useValue: {
            createAdminAccount: jest.fn(),
            getFormFieldsToConfirm: jest.fn(),
            accountConfirmation: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RegistrationController>(RegistrationController);
    // adminRegistrationService = module.get(AdminRegistrationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
