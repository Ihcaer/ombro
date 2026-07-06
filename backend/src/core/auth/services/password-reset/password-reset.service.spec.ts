/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetService } from './password-reset.service';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthAdmin, AuthOneTimeToken, Prisma } from '@generated/prisma-client';
import { HashService } from '@shared/hash/hash.service';
import { ResetPasswordRequestDto } from '@core/auth/dto';
import { OneTimeTokenContext } from '@core/auth/types/one-time-token.types';
import { PASSWORD_STRENGTH_VALIDATOR } from '@core/auth/providers/password-strength.provider';

describe('PasswordResetService', () => {
  let service: PasswordResetService;
  let tokenService: jest.Mocked<AuthTokenService>;
  let hashService: jest.Mocked<HashService>;
  let prismaService: jest.Mocked<PrismaService>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  const isPasswordStrongValidator = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordResetService,
        {
          provide: AuthTokenService,
          useValue: {
            generateOneTimeTokenPair: jest.fn(),
            fetchTokenContext: jest.fn(),
            validateOneTimeToken: jest.fn(),
          },
        },
        { provide: HashService, useValue: { hashBcrypt: jest.fn() } },
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            authOneTimeToken: { create: jest.fn(), delete: jest.fn() },
            authAdmin: { update: jest.fn() },
          },
        },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
        {
          provide: PASSWORD_STRENGTH_VALIDATOR,
          useValue: isPasswordStrongValidator,
        },
      ],
    }).compile();

    service = module.get<PasswordResetService>(PasswordResetService);
    tokenService = module.get(AuthTokenService);
    hashService = module.get(HashService);
    prismaService = module.get(PrismaService);
    eventEmitter = module.get(EventEmitter2);

    jest.clearAllMocks();
  });

  describe('.requestPasswordReset()', () => {
    let testEmail: string;
    let params: { email: string };
    let oneTimeTokenDb: Prisma.AuthOneTimeTokenGetPayload<{
      select: { admin: { select: { email: true } } };
    }>;

    beforeEach(() => {
      testEmail = 'test@example.com';
      params = { email: testEmail };

      const tokens = { rawToken: 'token', hashedToken: 'token-hash' };
      tokenService.generateOneTimeTokenPair.mockReturnValue(tokens);
    });

    it('should not return error', async () => {
      oneTimeTokenDb = { admin: { email: testEmail } };

      (prismaService.authOneTimeToken.create as jest.Mock).mockResolvedValue(oneTimeTokenDb);
      eventEmitter.emit.mockReturnValue(true);

      const result = await service.requestPasswordReset(params.email);
      expect(result).toBeUndefined();
      expect(eventEmitter.emit).toHaveBeenCalledTimes(1);
    });

    it('should handle hashed token uniqueness error (P2002)', async () => {
      const tokenColumn: keyof Pick<AuthOneTimeToken, 'hashedToken'> = 'hashedToken';
      const prismaTokenError = new Prisma.PrismaClientKnownRequestError(
        `Unique constraint failed on the fields: (${tokenColumn})`,
        { code: 'P2002', clientVersion: '7.2.0', meta: { target: [tokenColumn] } },
      );

      oneTimeTokenDb = { admin: { email: testEmail } };
      (prismaService.authOneTimeToken.create as jest.Mock)
        .mockRejectedValueOnce(prismaTokenError)
        .mockResolvedValue(oneTimeTokenDb);
      eventEmitter.emit.mockReturnValue(true);

      const result = await service.requestPasswordReset(params.email);
      expect(result).toBeUndefined();
      expect(prismaService.authOneTimeToken.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('.resetPasswordByToken()', () => {
    let params: { dto: ResetPasswordRequestDto };
    let tokenCtx: OneTimeTokenContext;

    beforeEach(() => {
      tokenCtx = {
        id: 1,
        adminId: 1,
        hashedToken: 'hashed-token',
        expiresAt: new Date(new Date(new Date().getTime() + 15 * 60 * 1000).toISOString()),
        type: 'PASSWORD_RESET',
        admin: { email: 'test@example.com', handleName: 'handle', displayName: 'display-name' },
      };

      isPasswordStrongValidator.mockReturnValue(true);
    });

    it('should execute successfully', async () => {
      params = { dto: { token: 'token', password: 'new-password' } };
      const mockUpdateValue: Pick<AuthAdmin, 'id'> = { id: 1 };
      const mockDeleteValue: Pick<AuthOneTimeToken, 'adminId'> = { adminId: 1 };

      tokenService.fetchTokenContext.mockResolvedValue(tokenCtx);
      tokenService.validateOneTimeToken.mockResolvedValue(undefined);
      hashService.hashBcrypt.mockResolvedValue('hashed-password');

      const mockUpdate = (prismaService.authAdmin.update as jest.Mock).mockReturnValue(
        mockUpdateValue,
      );
      const mockDelete = (prismaService.authOneTimeToken.delete as jest.Mock).mockReturnValue(
        mockDeleteValue,
      );
      prismaService.$transaction.mockResolvedValue([mockUpdate, mockDelete]);

      const result = await service.resetPasswordByToken(params.dto);

      expect(result).toBeUndefined();
      expect(tokenService.fetchTokenContext).toHaveBeenCalled();
      expect(tokenService.validateOneTimeToken).toHaveBeenCalled();
      expect(isPasswordStrongValidator).toHaveBeenCalled();
      expect(hashService.hashBcrypt).toHaveBeenCalled();
      expect(prismaService.$transaction).toHaveBeenCalled();
    });
  });
});
