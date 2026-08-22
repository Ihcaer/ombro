import { Test, TestingModule } from '@nestjs/testing';
import { AdminRegistrationService } from './admin-registration.service';
import { HashService } from '@shared/hash/hash.service';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { OneTimeTokenContext } from '@core/auth/types/one-time-token.types';
import { BadRequestException } from '@nestjs/common';
import { AuthAdmin, AuthOneTimeToken } from '@generated/prisma-client';
import {
  ConfirmAdminAccountFormFieldResponseDto,
  ConfirmAdminRequestDto,
  CreateAdminRequestDto,
  CreateAdminResponseDto,
} from '@core/auth/dto';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { plainToInstance } from 'class-transformer';
import { AuthAdminRepository } from '@core/auth/auth-admin.repository';
import { PrivilegesUtils } from '@core/auth/utils/privileges.utils';
import { PASSWORD_STRENGTH_VALIDATOR } from '@core/auth/providers/password-strength.provider';
import { DEFAULT_ADMIN_PREFERENCES } from '@core/auth/auth.constants';
import { JsonValue } from '@generated/prisma-client/runtime/client';

describe('AdminRegistrationService', () => {
  let service: AdminRegistrationService;
  let hashService: jest.Mocked<HashService>;
  let prismaService: jest.Mocked<PrismaService>;
  let tokenService: jest.Mocked<AuthTokenService>;
  // let authAdminRepository: jest.Mocked<AuthAdminRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  const isPasswordStrongValidator = jest.fn();

  beforeEach(async () => {
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
              create: jest.fn(),
            },
            authAdmin: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: AuthTokenService,
          useValue: {
            generateOneTimeTokenPair: jest.fn(),
            fetchTokenContext: jest.fn(),
            validateOneTimeToken: jest.fn(),
          },
        },
        { provide: AuthAdminRepository, useValue: { deleteOneTimeTokenById: jest.fn() } },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
        {
          provide: PASSWORD_STRENGTH_VALIDATOR,
          useValue: isPasswordStrongValidator,
        },
      ],
    }).compile();

    service = module.get<AdminRegistrationService>(AdminRegistrationService);
    hashService = module.get(HashService);
    prismaService = module.get(PrismaService);
    tokenService = module.get(AuthTokenService);
    // authAdminRepository = module.get(AuthAdminRepository);
    eventEmitter = module.get(EventEmitter2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('.createAdminAccount()', () => {
    let params: [CreateAdminRequestDto];

    it('should return correct new admin data (DTO)', async () => {
      params = [
        plainToInstance(CreateAdminRequestDto, {
          displayName: 'name',
          email: 'test@email.com',
          privileges: PrivilegesUtils.arrayToBitmask(['ADMINS_MANAGE']),
        }),
      ];
      const requestDto: Readonly<CreateAdminRequestDto> = params[0];
      const expectedResult: Readonly<CreateAdminResponseDto> = {
        displayName: requestDto.displayName,
        email: requestDto.email,
        privileges: PrivilegesUtils.bitmaskToArray(requestDto.privileges),
      };
      const tokenPair = { rawToken: 'token', hashedToken: 'tokenHash' };
      const createdAdminMock = { admin: { ...requestDto } };

      tokenService.generateOneTimeTokenPair.mockReturnValue(tokenPair);
      (prismaService.authOneTimeToken.create as jest.Mock).mockResolvedValue(createdAdminMock);
      eventEmitter.emit.mockReturnValue(true);

      expect(params[0]).toBeInstanceOf(CreateAdminRequestDto);
      await expect(service.createAdminAccount(...params)).resolves.toEqual(expectedResult);
    });
  });

  describe('Account confirmation methods', () => {
    const token: Readonly<string> = 'tokenValue';
    let tokenContext: OneTimeTokenContext | null;
    let mockNow: Date;
    let tokenExpirationTime: Date;
    let mockFindToken: (value: OneTimeTokenContext | null) => void;

    beforeEach(() => {
      mockNow = new Date();
      jest.useFakeTimers().setSystemTime(mockNow);

      mockFindToken = (value): void => {
        if (value === null) {
          tokenService.fetchTokenContext.mockRejectedValue(new BadRequestException());
        } else {
          tokenService.fetchTokenContext.mockResolvedValue(value);
        }
      };
    });

    afterEach(() => jest.useRealTimers());

    describe('.getFormFieldsToConfirm()', () => {
      let hashedToken: Readonly<string>;

      beforeEach(() => {
        hashedToken = 'tokenHash';
        hashService.hash.mockReturnValue(hashedToken);
      });

      it('should validate token correctly and return fields names', async () => {
        tokenExpirationTime = new Date(
          new Date(mockNow.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        );

        tokenContext = {
          id: 1,
          adminId: 1,
          hashedToken,
          expiresAt: tokenExpirationTime,
          type: 'REGISTER',
          admin: {
            verification: 'WAITING',
            password: null,
            handleName: 'handle',
          },
        };
        const expectedResult: ConfirmAdminAccountFormFieldResponseDto = { fields: ['password'] };

        mockFindToken(tokenContext);

        await expect(service.getFormFieldsToConfirm(token)).resolves.toEqual(expectedResult);
      });
    });
    describe('.accountConfirmation()', () => {
      let hashedToken: string;
      let hashedPassword: string;
      let findAdminMock: Pick<AuthAdmin, 'preferences'>,
        deleteValueMock: AuthOneTimeToken,
        updateValueMock: Partial<AuthAdmin>;
      let parameters: ConfirmAdminRequestDto;

      beforeEach(() => {
        hashedToken = 'tokenHash';
        hashService.hash.mockReturnValue(hashedToken);
        isPasswordStrongValidator.mockReturnValue(true);
      });

      it('should parse token and confirmation data, update admin status if data are correct', async () => {
        tokenExpirationTime = new Date(
          new Date(mockNow.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        );
        tokenContext = {
          id: 1,
          adminId: 1,
          hashedToken,
          expiresAt: tokenExpirationTime,
          type: 'REGISTER',
          admin: {
            verification: 'WAITING',
            password: null,
            handleName: 'handle',
          },
        };
        hashedPassword = 'hashedPassword';

        findAdminMock = { preferences: DEFAULT_ADMIN_PREFERENCES as unknown as JsonValue };
        deleteValueMock = {
          id: 1,
          adminId: tokenContext.adminId,
          hashedToken: tokenContext.hashedToken,
          type: 'REGISTER',
          expiresAt: tokenContext.expiresAt,
        };
        updateValueMock = { verification: 'VERIFIED' };

        parameters = {
          oneTimeToken: 'token',
          password: 'password',
          language: DEFAULT_ADMIN_PREFERENCES.language,
        };

        mockFindToken(tokenContext);
        hashService.hashBcrypt.mockResolvedValue(hashedPassword);
        jest
          .spyOn(prismaService.authAdmin, 'findUnique')
          .mockResolvedValue(findAdminMock as AuthAdmin);
        jest.spyOn(prismaService.authOneTimeToken, 'delete').mockResolvedValue(deleteValueMock);
        jest
          .spyOn(prismaService.authAdmin, 'update')
          .mockResolvedValue(updateValueMock as AuthAdmin);

        await expect(service.accountConfirmation(parameters)).resolves.not.toThrow();
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(prismaService.$transaction).toHaveBeenCalledWith(expect.any(Function));
      });
    });
  });
});
