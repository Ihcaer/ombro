import {
  ConfirmAdminAccountFormFieldDto,
  ConfirmAdminRequestDto,
  CreateAdminRequestDto,
  CreateAdminResponseDto,
} from '@core/auth/dto';
import { AdminConfirmationData } from '@core/auth/interfaces/admin-registration.interfaces';
import { OneTimeTokenContext } from '@core/auth/types/one-time-token.types';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { AuthAdmin, AuthVerification, Prisma } from '@generated/prisma-client';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HashService } from '@shared/hash/hash.service';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AdminCreatedEvent } from '@core/auth/events/admin-created.event';
import { PossibleFieldsToFill } from '@core/auth/types/common.types';
import { PASSWORD_SALT_ROUNDS } from '@core/auth/auth.constants';
import { AuthAdminRepository } from '@core/auth/auth-admin.repository';
import { PrivilegesUtils } from '@core/auth/utils/privileges.utils';
import { PASSWORD_STRENGTH_VALIDATOR } from '@core/auth/providers/password-strength.provider';
import type { PasswordStrengthValidatorFn } from '@core/auth/providers/password-strength.provider';

@Injectable()
export class AdminRegistrationService {
  private static readonly REGISTER_TOKEN_EXPIRATION_MS = 24 * 60 * 60 * 1000;
  private static readonly POSSIBLE_COLUMNS_TO_FILL_OUT: (keyof PossibleFieldsToFill)[] = [
    'password',
    'handleName',
  ];

  constructor(
    private readonly hashService: HashService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: AuthTokenService,
    private readonly authAdminRepository: AuthAdminRepository,
    private readonly eventEmitter: EventEmitter2,
    @Inject(PASSWORD_STRENGTH_VALIDATOR)
    private readonly isPasswordStrongValidator: PasswordStrengthValidatorFn,
  ) {}

  async createAdminAccount(dto: CreateAdminRequestDto): Promise<CreateAdminResponseDto> {
    let attempts = 0;
    const maxAttempts = 5;
    let rawToken: Base64URLString | null = null;
    let result: CreateAdminResponseDto | null = null;

    while (attempts < maxAttempts) {
      try {
        const token = this.tokenService.generateOneTimeTokenPair();
        const expiresAt = AuthTokenService.calculateOneTimeTokenExpirationDate(
          AdminRegistrationService.REGISTER_TOKEN_EXPIRATION_MS,
        );
        rawToken = token.rawToken;

        const createdAdmin = await this.prismaService.authOneTimeToken.create({
          data: {
            hashedToken: token.hashedToken,
            type: 'REGISTER',
            expiresAt,
            admin: { create: dto },
          },
          select: {
            admin: {
              select: { displayName: true, email: true, privileges: true },
            },
          },
        });

        const { admin } = createdAdmin;
        result = {
          displayName: admin.displayName,
          email: admin.email,
          privileges: PrivilegesUtils.bitmaskToArray(admin.privileges),
        };

        break;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          const target = error.meta?.target;

          if (typeof target === 'string' || Array.isArray(target)) {
            switch (true) {
              case target.includes('email'):
                throw new BadRequestException('This email is already in use.');
              case target.includes('hashedToken'):
                attempts++;
                continue;
            }
          }
          throw error;
        }
        throw error;
      }
    }

    if (rawToken && result) {
      const { EVENT_NAME: eventName } = AdminCreatedEvent;
      const wasHandled: boolean = this.eventEmitter.emit(
        eventName,
        new AdminCreatedEvent(rawToken, {
          name: result.displayName,
          email: result.email,
        }),
      );

      if (!wasHandled) {
        console.warn(`The ${eventName} event was emitted but no one received it!`);
      }

      return result;
    } else {
      console.error('Failed to generate unique token.');
      throw new InternalServerErrorException(
        'We encountered an unexpected problem while creating account of new admin. Please try again later. If the issue persists, contact our support team.',
      );
    }
  }

  async getFormFieldsToConfirm(inputToken: string): Promise<ConfirmAdminAccountFormFieldDto> {
    const possibleFieldsToFillOut = [...AdminRegistrationService.POSSIBLE_COLUMNS_TO_FILL_OUT];

    const tokenContext: OneTimeTokenContext = await this.tokenService.fetchTokenContext(
      inputToken,
      'REGISTER',
      possibleFieldsToFillOut,
    );

    await this.tokenService.validateOneTimeToken(tokenContext, 'REGISTER');

    const fieldsToFillOut = possibleFieldsToFillOut.filter(
      (field) => tokenContext.admin![field] === null,
    );
    if (fieldsToFillOut.length === 0) {
      await this.authAdminRepository.deleteOneTimeTokenById(tokenContext.id);
      throw new UnprocessableEntityException({
        message: 'Account is not waiting for verification',
        reason: 'VERIFICATION_IS_NOT_CAPABLE',
      });
    }

    return fieldsToFillOut;
  }

  async accountConfirmation(dto: ConfirmAdminRequestDto): Promise<void> {
    const { oneTimeToken, ...fieldsToFill } = dto;

    const adminFields: Readonly<keyof AuthAdmin>[] = ['email', 'handleName', 'displayName'];
    const tokenContext: OneTimeTokenContext = await this.tokenService.fetchTokenContext(
      oneTimeToken,
      'REGISTER',
      [...adminFields],
    );
    const handleName: string = (dto.handleName || tokenContext.admin?.handleName) as string;

    await this.tokenService.validateOneTimeToken(tokenContext, 'REGISTER');

    const admin: Partial<AuthAdmin> = { ...tokenContext.admin, handleName };
    const adminInfo: Readonly<string>[] = adminFields.map((key) => {
      const value = admin[key];
      if (typeof value === 'boolean' || value === null || typeof value === 'undefined') return '';
      return String(value);
    });

    const isStrongPassword: boolean = this.isPasswordStrongValidator(dto.password, [...adminInfo]);
    if (!isStrongPassword)
      throw new BadRequestException(
        'The password is too weak or contains data from an email, handle or display name.',
      );

    const hashedPassword = await this.hashService.hashBcrypt(dto.password, PASSWORD_SALT_ROUNDS);
    const adminData: AdminConfirmationData = {
      ...fieldsToFill,
      password: hashedPassword,
      id: tokenContext.adminId,
      refreshTokenId: tokenContext.id,
    };
    await this.updateAdminVerification(adminData);
  }

  private async updateAdminVerification(
    adminData: AdminConfirmationData,
    wantedVerificationStatus: AuthVerification = AuthVerification.VERIFIED,
  ): Promise<void> {
    const { id, refreshTokenId, ...dataToUpdate } = adminData;

    try {
      await this.prismaService.$transaction([
        this.prismaService.authOneTimeToken.delete({
          where: { id: refreshTokenId },
        }),
        this.prismaService.authAdmin.update({
          where: { id },
          data: { ...dataToUpdate, verification: wantedVerificationStatus },
          select: { verification: true },
        }),
      ]);
    } catch (error) {
      console.error('Transaction error:', error);
      throw new InternalServerErrorException('Failed to update data. Please try again later.');
    }
  }
}
