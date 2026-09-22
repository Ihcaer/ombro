import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationAdminController } from './registration-admin.controller';
import { AdminRegistrationService } from '@core/auth/services/admin-registration/admin-registration.service';
import { AccessTokenGuard } from '@core/auth/guards/access-token.guard';
import { mockGuard } from '@shared/testing/mock-guard';

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
    })
      .overrideGuard(AccessTokenGuard)
      .useValue(mockGuard())
      .compile();

    controller = module.get<RegistrationAdminController>(RegistrationAdminController);
    // adminRegistrationService = module.get(AdminRegistrationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
