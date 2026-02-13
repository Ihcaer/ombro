import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetController } from './password-reset.controller';
import { PasswordResetService } from '@core/auth/services/password-reset/password-reset.service';

describe('PasswordResetController', () => {
  let controller: PasswordResetController;
  // let passwordResetService: jest.Mocked<PasswordResetService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordResetController],
      providers: [
        {
          provide: PasswordResetService,
          useValue: { requestPasswordReset: jest.fn(), resetPasswordByToken: jest.fn() },
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
