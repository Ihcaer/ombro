import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetController } from './password-reset.controller.js';
import { PasswordResetService } from '@core/auth/services/password-reset/password-reset.service.js';

describe('PasswordResetController', () => {
  let controller: PasswordResetController;
  // let passwordResetService: Mocked<PasswordResetService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordResetController],
      providers: [
        {
          provide: PasswordResetService,
          useValue: { requestPasswordReset: vi.fn(), resetPasswordByToken: vi.fn() },
        },
      ],
    }).compile();

    controller = module.get<PasswordResetController>(PasswordResetController);
    // passwordResetService = module.get(PasswordResetService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
