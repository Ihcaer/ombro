import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { Prisma } from '@generated/prisma-client';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AdminPasswordResetRequestEvent } from '@core/auth/events/admin-password-reset-request.event';
import { ResetPasswordRequestDto } from '@core/auth/dto';
import { OneTimeTokenContext } from '@core/auth/types/one-time-token.types';
import { HashService } from '@shared/hash/hash.service';
import { PASSWORD_SALT_ROUNDS } from '@core/auth/auth.constants';
import { PASSWORD_STRENGTH_VALIDATOR } from '@core/auth/providers/password-strength.provider';
import type { PasswordStrengthValidatorFn } from '@core/auth/providers/password-strength.provider';
import { AdminWithoutPreferences } from '@core/auth/types/admin.types';

@Injectable()
export class PasswordResetService {
  static readonly DEFAULT_RESET_PASSWORD_INTERNAL_ERR_MESSAGE: string =
    'We encountered an unexpected problem while resetting your password. Please try again later. If the issue persists, contact our support team.';

  private static readonly RESET_PASSWORD_TOKEN_EXPIRATION_MS = 15 * 60 * 1000;

  private readonly logger = new Logger(PasswordResetService.name);

  constructor(
    private readonly tokenService: AuthTokenService,
    private readonly hashService: HashService,
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(PASSWORD_STRENGTH_VALIDATOR)
    private readonly isPasswordStrongValidator: PasswordStrengthValidatorFn,
  ) {}

  async requestPasswordReset(email: string): Promise<void> {
    const maxAttempts = 5;
    const eventName = AdminPasswordResetRequestEvent.EVENT_NAME;
    let eventData: AdminPasswordResetRequestEvent['payload'] | null = null;
    let adminId: number | null = null;

    for (let i = 0; i < maxAttempts; i++) {
      try {
        const token = this.tokenService.generateOneTimeTokenPair();
        const expirationTimeMs = PasswordResetService.RESET_PASSWORD_TOKEN_EXPIRATION_MS;

        const expiresAt = AuthTokenService.calculateOneTimeTokenExpirationDate(expirationTimeMs);

        const { admin } = await this.prismaService.authOneTimeToken.create({
          data: {
            hashedToken: token.hashedToken,
            type: 'PASSWORD_RESET',
            expiresAt,
            admin: { connect: { email } },
          },
          select: { admin: { select: { id: true, displayName: true } } },
        });

        eventData = {
          tokenData: {
            token: token.rawToken,
            expirationTimeMinutes: expirationTimeMs / (60 * 1000),
          },
          adminData: { name: admin.displayName, email },
        };
        adminId = admin.id;

        break;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          const target = error.meta?.target;

          switch (true) {
            case error.code === 'P2002' &&
              (typeof target === 'string' || Array.isArray(target)) &&
              target.includes('hashedToken'):
              continue;
            case error.code === 'P2025':
              return;
          }
          throw error;
        }
        throw error;
      }
    }

    if (eventData) {
      const wasHandled = this.eventEmitter.emit(
        eventName,
        new AdminPasswordResetRequestEvent({
          tokenData: eventData.tokenData,
          adminData: eventData.adminData,
        }),
      );
      if (!wasHandled)
        this.logger.error(
          `The ${eventName} event was emitted but no one received it. Admin (User) ID ${adminId ?? 'unknown'}`,
        );
    } else {
      this.logger.error(`Failed to generate unique OTP token for Admin (User) ID ${adminId}`);
      throw new InternalServerErrorException(
        PasswordResetService.DEFAULT_RESET_PASSWORD_INTERNAL_ERR_MESSAGE,
      );
    }
  }

  async resetPasswordByToken(dto: ResetPasswordRequestDto): Promise<void> {
    const adminFields: Readonly<keyof AdminWithoutPreferences>[] = [
      'email',
      'handleName',
      'displayName',
    ];

    const tokenContext: OneTimeTokenContext = await this.tokenService.fetchTokenContext(
      dto.token,
      'PASSWORD_RESET',
      [...adminFields],
    );
    await this.tokenService.validateOneTimeToken(tokenContext, 'PASSWORD_RESET');

    const { admin } = tokenContext;
    if (!admin) {
      this.logger.error(
        'resetPasswordByToken() method do not have needed admin data to proceed request.',
      );
      throw new UnprocessableEntityException({
        errorCode: 'WEAK_PASSWORD',
        message: PasswordResetService.DEFAULT_RESET_PASSWORD_INTERNAL_ERR_MESSAGE,
      });
    }

    const adminInfo: Readonly<string>[] = adminFields.map((key) => {
      const value = admin[key];
      if (typeof value === 'boolean' || value === null || typeof value === 'undefined') return '';
      return String(value);
    });
    const isPasswordStrong: boolean = this.isPasswordStrongValidator(dto.password, [...adminInfo]);
    if (!isPasswordStrong)
      throw new UnprocessableEntityException(
        'The password is too weak or contains data from an email, handle or display name.',
      );

    const hashedPassword = await this.hashService.hashBcrypt(dto.password, PASSWORD_SALT_ROUNDS);

    try {
      await this.prismaService.$transaction([
        this.prismaService.authAdmin.update({
          where: { id: tokenContext.adminId },
          data: { password: hashedPassword },
          select: { id: true },
        }),
        this.prismaService.authOneTimeToken.delete({
          where: { id: tokenContext.id },
          select: { id: true },
        }),
      ]);
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        const model = error.meta?.modelName as Prisma.ModelName;

        switch (model) {
          case 'AuthAdmin':
            this.logger.error(
              'resetPasswordByToken() method do not have needed admin to proceed request.',
            );
            break;
          case 'AuthOneTimeToken':
            this.logger.error(
              'resetPasswordByToken() do not have needed one time token to proceed request.',
            );
            break;
        }

        throw new InternalServerErrorException(
          PasswordResetService.DEFAULT_RESET_PASSWORD_INTERNAL_ERR_MESSAGE,
        );
      }
      throw error;
    }
  }
}
