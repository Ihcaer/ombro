import { PASSWORD_SALT_ROUNDS } from '@core/auth/auth.constants.js';
import { ChangePasswordRequestDto } from '@core/auth/dto/requests/change-password-request.dto.js';
import { AdminPasswordChangedEvent } from '@core/auth/events/admin-password-changed.event.js';
import {
  PASSWORD_STRENGTH_VALIDATOR,
  type PasswordStrengthValidatorFn,
} from '@core/auth/providers/password-strength.provider.js';
import { AdminData, AdminFieldsToCompareWithPassword } from '@core/auth/types/admin.types.js';
import { AccessJwtPayload } from '@core/auth/types/jwt.types.js';
import { PrismaService } from '@core/database/prisma/prisma.service.js';
import { AuthAdminSelect } from '@generated/prisma-client/models.js';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HashService } from '@shared/hash/hash.service.js';

@Injectable()
export class AdminCredentialsService {
  private readonly logger = new Logger(AdminCredentialsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(PASSWORD_STRENGTH_VALIDATOR)
    private readonly isPasswordStrongValidator: PasswordStrengthValidatorFn,
  ) {}

  async changePassword(
    dto: ChangePasswordRequestDto,
    adminId: AdminData['id'],
    sessionId: AccessJwtPayload['sessionId'],
  ): Promise<void> {
    const columnsToCompareWithPassword: AdminFieldsToCompareWithPassword = [
      'email',
      'handleName',
      'displayName',
    ];
    const columnsToCompareForQuery = Object.fromEntries(
      columnsToCompareWithPassword.map((key) => [key, true]),
    ) as Record<(typeof columnsToCompareWithPassword)[number], true>;
    const neededAdminFields: AuthAdminSelect = { ...columnsToCompareForQuery, password: true };
    const actualAdmin = await this.prisma.authAdmin.findUnique({
      where: { id: adminId },
      select: neededAdminFields,
    });
    if (!actualAdmin || !actualAdmin.password) {
      this.logger.warn('Password change attempted for non-existent admin (user) ID: ' + adminId);
      throw new UnauthorizedException();
    }

    const currentPasswordAreSame: boolean = await this.hashService.compareBcrypt(
      dto.currentPassword,
      actualAdmin?.password,
    );
    if (!currentPasswordAreSame) throw new BadRequestException('The current password is incorrect');

    const fieldsToCompareWithPassword: Readonly<string[]> = columnsToCompareWithPassword.map(
      (key) => {
        const value = actualAdmin[key];
        if (typeof value === 'boolean' || value === null || typeof value === 'undefined') return '';
        return String(value);
      },
    );
    const isPasswordStrong = this.isPasswordStrongValidator(dto.newPassword, [
      ...fieldsToCompareWithPassword,
    ]);
    if (!isPasswordStrong) {
      throw new BadRequestException(
        'The password is too weak or contains data from an email, handle or display name.',
      );
    }

    const newHashedPassword = await this.hashService.hashBcrypt(
      dto.newPassword,
      PASSWORD_SALT_ROUNDS,
    );

    await this.prisma.$transaction([
      this.prisma.authAdmin.update({
        where: { id: adminId },
        data: { password: newHashedPassword },
        select: { id: true },
      }),
      this.prisma.authRefreshToken.deleteMany({
        where: { adminId, sessionId: { not: sessionId } },
      }),
    ]);

    // Additional event
    const eventName = AdminPasswordChangedEvent.EVENT_NAME;
    const wasHandled: boolean = this.eventEmitter.emit(
      eventName,
      new AdminPasswordChangedEvent({ adminId }),
    );
    if (!wasHandled) {
      this.logger.error(
        `The ${eventName} event was emitted but no one received it. Admin (user) ID ${adminId}`,
      );
    }
  }
}
