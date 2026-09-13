import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationPublicController } from './registration-public.controller';
import { AdminRegistrationService } from '@core/auth/services/admin-registration/admin-registration.service';

describe('RegistrationPublicController', () => {
  let controller: RegistrationPublicController;
  // let adminRegistrationService: jest.Mocked<AdminRegistrationService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationPublicController],
      providers: [
        {
          provide: AdminRegistrationService,
          useValue: {
            getFormFieldsToConfirm: jest.fn(),
            accountConfirmation: jest.fn(),
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
