import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { AuthAdmin, Prisma } from '@generated/prisma-client';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PasswordResetRequestEvent } from '@core/auth/events/password-reset-request.event';
import { ResetPasswordRequestDto } from '@core/auth/dto';
import { OneTimeTokenContext } from '@core/auth/types/one-time-token.types';
import { checkPasswordStrengthUtil } from '@core/auth/utils/check-password-strength/check-password-strength.util';
import { HashService } from '@shared/hash/hash.service';
import { PASSWORD_SALT_ROUNDS } from '@core/auth/auth.constants';

@Injectable()
export class PasswordResetService {
  private static readonly RESET_PASSWORD_TOKEN_EXPIRATION_MS = 15 * 60 * 1000;
  private static readonly DEFAULT_RESET_PASSWORD_INTERNAL_ERR_MESSAGE: string =
    'We encountered an unexpected problem while resetting your password. Please try again later. If the issue persists, contact our support team.';

  constructor(
    private readonly tokenService: AuthTokenService,
    private readonly hashService: HashService,
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async requestPasswordReset(email: string): Promise<void> {
    const maxAttempts = 5;
    const eventName = PasswordResetRequestEvent.EVENT_NAME;
    let eventData: PasswordResetRequestEvent | null = null;

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
          select: { admin: { select: { displayName: true } } },
        });

        eventData = {
          tokenData: {
            token: token.rawToken,
            expirationTimeMinutes: expirationTimeMs / (60 * 1000),
          },
          adminData: { name: admin.displayName, email },
        };
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
        new PasswordResetRequestEvent(eventData.tokenData, eventData.adminData),
      );
      if (!wasHandled) console.warn(`The ${eventName} event was emitted but no one received it!`);
    } else {
      console.error('Failed to generate unique token.');
      throw new InternalServerErrorException(
        PasswordResetService.DEFAULT_RESET_PASSWORD_INTERNAL_ERR_MESSAGE,
      );
    }
  }

  async resetPasswordByToken(dto: ResetPasswordRequestDto): Promise<void> {
    const adminFields: Readonly<keyof AuthAdmin>[] = ['email', 'handleName', 'displayName'];

    const tokenContext: OneTimeTokenContext = await this.tokenService.fetchTokenContext(
      dto.token,
      'PASSWORD_RESET',
      [...adminFields],
    );
    await this.tokenService.validateOneTimeToken(tokenContext, 'PASSWORD_RESET');

    const { admin } = tokenContext;
    if (!admin) {
      console.error('resetPasswordByToken() method do not have needed admin to proceed request.');
      throw new InternalServerErrorException({
        errorCode: 'WEAK_PASSWORD',
        message: PasswordResetService.DEFAULT_RESET_PASSWORD_INTERNAL_ERR_MESSAGE,
      });
    }

    const adminInfo: Readonly<string>[] = adminFields.map((key) => {
      const value = admin[key];
      if (typeof value === 'boolean' || value === null || typeof value === 'undefined') return '';
      return String(value);
    });
    const isPasswordStrong: boolean = checkPasswordStrengthUtil(dto.password, [...adminInfo]);
    if (!isPasswordStrong)
      throw new BadRequestException(
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

        if (model) {
          switch (true) {
            case model === 'AuthAdmin':
              console.error(
                'resetPasswordByToken() method do not have needed admin to proceed request.',
              );
              break;
            case model === 'AuthOneTimeToken':
              console.error(
                'resetPasswordByToken() do not have needed one time token to proceed request.',
              );
              break;
          }
        }
        throw new InternalServerErrorException(
          PasswordResetService.DEFAULT_RESET_PASSWORD_INTERNAL_ERR_MESSAGE,
        );
      }
      throw error;
    }
  }
}
