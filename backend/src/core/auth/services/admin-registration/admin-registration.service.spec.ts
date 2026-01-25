import { Test, TestingModule } from '@nestjs/testing';
import { AdminRegistrationService } from './admin-registration.service';
import { HashService } from '@shared/hash/hash.service';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { OneTimeTokenContext } from '@core/auth/types/one-time-token.types';
import {
  BadRequestException,
  GoneException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthOneTimeToken, AuthVerification } from '@generated/prisma-client';

describe('AdminRegistrationService', () => {
  let service: AdminRegistrationService;
  let hashService: jest.Mocked<HashService>;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminRegistrationService,
        {
          provide: HashService,
          useValue: { hashBcrypt: jest.fn(), hash: jest.fn() },
        },
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            authOneTimeToken: {
              delete: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AdminRegistrationService>(AdminRegistrationService);
    hashService = module.get(HashService);
    prismaService = module.get(PrismaService);
  });

  describe('Account confirmation methods', () => {
    const token: Readonly<string> = 'tokenValue';
    let tokenContext: OneTimeTokenContext | null;
    let mockNow: Date;
    let tokenExpirationTime: Date;

    beforeEach(() => {
      mockNow = new Date();
      jest.useFakeTimers().setSystemTime(mockNow);
    });

    afterEach(() => jest.useRealTimers());

    describe('.getFormFieldsToConfirm()', () => {
      let hashedToken: Readonly<string>;
      const mockFindUnique = (value: OneTimeTokenContext | null): void => {
        (
          prismaService.authOneTimeToken.findUnique as jest.Mock
        ).mockResolvedValue(value);
      };

      beforeEach(() => {
        hashedToken = 'tokenHash';
        hashService.hash.mockReturnValue(hashedToken);
      });

      it('should validate token correctly and return fields names', async () => {
        tokenExpirationTime = new Date(
          new Date(mockNow.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        );

        tokenContext = {
          adminId: 1,
          hashedToken,
          expiresAt: tokenExpirationTime,
          admin: {
            verification: 'WAITING',
            password: null,
            handleName: 'handle',
          },
        };
        const expectedResult = ['password'];

        mockFindUnique(tokenContext);

        await expect(service.getFormFieldsToConfirm(token)).resolves.toEqual(
          expectedResult,
        );
      });

      it.each([
        {
          tokenData: null,
          expected: BadRequestException,
          errorName: 'BadRequestException',
          desc: 'token not found',
        },
        {
          tokenData: {
            expirationOffset: -(24 * 60 * 60 * 1000),
            admin: {
              verification: AuthVerification.WAITING,
              password: null,
            },
          },
          expected: GoneException,
          errorName: 'BadRequestException',
          desc: 'token expired',
        },
        {
          tokenData: {
            expirationOffset: 24 * 60 * 60 * 1000,
            admin: {
              verification: AuthVerification.VERIFIED,
              password: null,
            },
          },
          expected: UnprocessableEntityException,
          errorName: 'UnprocessableEntityException',
          desc: 'admin is not waiting for verification',
        },
        {
          tokenData: {
            expirationOffset: 24 * 60 * 60 * 1000,
            admin: {
              verification: AuthVerification.WAITING,
              password: 'password',
            },
          },
          expected: UnprocessableEntityException,
          errorName: 'UnprocessableEntityException',
          desc: 'admin fields are not need confirmation (all are filled)',
        },
      ])(
        'should throw $errorName error class for scenario: $desc',
        async ({ tokenData, expected }) => {
          const calculateExpirationTime = (offset: number): Date => {
            return new Date(new Date(mockNow.getTime() + offset).toISOString());
          };
          const tokenContext: OneTimeTokenContext | null = tokenData
            ? {
                adminId: 1,
                hashedToken,
                expiresAt: calculateExpirationTime(tokenData.expirationOffset),
                admin: {
                  verification: tokenData.admin.verification,
                  password: tokenData.admin.password,
                },
              }
            : null;
          const tokenRecord: AuthOneTimeToken | null = tokenContext
            ? {
                adminId: tokenContext.adminId,
                hashedToken: tokenContext.hashedToken,
                type: 'REGISTER',
                expiresAt: tokenContext.expiresAt,
              }
            : null;

          mockFindUnique(tokenContext);
          (
            prismaService.authOneTimeToken.delete as jest.Mock
          ).mockResolvedValue(tokenRecord);

          await expect(service.getFormFieldsToConfirm(token)).rejects.toThrow(
            expected,
          );
        },
      );
    });
    describe('.accountConfirmation()', () => {});
  });
});
