import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationAdminController } from './registration-admin.controller';
import { AdminRegistrationService } from '@core/auth/services/admin-registration/admin-registration.service';

describe('RegistrationAdminController', () => {
  let controller: RegistrationAdminController;
  // let adminRegistrationService: jest.Mocked<AdminRegistrationService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationAdminController],
      providers: [
        {
          provide: AdminRegistrationService,
          useValue: {
            createAdminAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RegistrationAdminController>(RegistrationAdminController);
    // adminRegistrationService = module.get(AdminRegistrationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
