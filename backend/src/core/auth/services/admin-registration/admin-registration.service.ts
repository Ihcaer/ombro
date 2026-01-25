import {
  ConfirmAdminAccountFormFieldDto,
  ConfirmAdminRequestDto,
} from '@core/auth/dto';
import { AdminConfirmationData } from '@core/auth/interfaces/admin-registration.interfaces';
import { OneTimeTokenContext } from '@core/auth/types/one-time-token.types';
import { PrismaService } from '@core/database/prisma/prisma.service';
import {
  AuthAdmin,
  AuthTokenType,
  AuthVerification,
} from '@generated/prisma-client';
import {
  BadRequestException,
  GoneException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HashService } from '@shared/hash/hash.service';

@Injectable()
export class AdminRegistrationService {
  private static readonly POSSIBLE_FIELDS_TO_FILL_OUT: (keyof ConfirmAdminRequestDto)[] =
    ['password', 'handleName'];

  constructor(
    private readonly hashService: HashService,
    private readonly prismaService: PrismaService,
  ) {}

  async getFormFieldsToConfirm(
    inputToken: string,
  ): Promise<ConfirmAdminAccountFormFieldDto> {
    const possibleFieldsToFillOut = [
      ...AdminRegistrationService.POSSIBLE_FIELDS_TO_FILL_OUT,
    ];

    const tokenContext: OneTimeTokenContext = await this.fetchTokenContext(
      inputToken,
      'REGISTER',
      possibleFieldsToFillOut,
    );

    await this.validateRegisterOneTimeToken(tokenContext);

    const fieldsToFillOut = possibleFieldsToFillOut.filter(
      (field) => tokenContext.admin![field] === null,
    );
    if (fieldsToFillOut.length === 0) {
      await this.deleteOneTimeTokenRecord(tokenContext.adminId);
      throw new UnprocessableEntityException({
        message: 'Account is not waiting for verification',
        reason: 'VERIFICATION_IS_NOT_CAPABLE',
      });
    }

    return fieldsToFillOut;
  }

  async accountConfirmation(
    inputToken: string,
    dto: ConfirmAdminRequestDto,
  ): Promise<void> {
    const tokenContext: OneTimeTokenContext = await this.fetchTokenContext(
      inputToken,
      'REGISTER',
    );

    await this.validateRegisterOneTimeToken(tokenContext);

    const hashedPassword = await this.hashService.hashBcrypt(dto.password);
    const adminData: AdminConfirmationData = {
      ...dto,
      password: hashedPassword,
      id: tokenContext.adminId,
    };
    await this.updateAdminVerification(adminData);
  }

  private async updateAdminVerification(
    adminData: AdminConfirmationData,
    wantedVerificationStatus: AuthVerification = AuthVerification.VERIFIED,
  ): Promise<void> {
    const { id, ...dataToUpdate } = adminData;

    try {
      await this.prismaService.$transaction([
        this.prismaService.authOneTimeToken.delete({
          where: { adminId: id },
        }),
        this.prismaService.authAdmin.update({
          where: { id },
          data: { ...dataToUpdate, verification: wantedVerificationStatus },
        }),
      ]);
    } catch (error) {
      console.log('Transaction error:', error);
      throw new InternalServerErrorException(
        'Failed to update data. Please try again later.',
      );
    }
  }

  private async validateRegisterOneTimeToken(
    tokenContext: OneTimeTokenContext,
  ): Promise<void> {
    if (tokenContext.expiresAt < new Date()) {
      await this.deleteOneTimeTokenRecord(tokenContext.adminId);
      throw new GoneException('Token expired');
    }

    if (tokenContext.admin && tokenContext.admin.verification !== 'WAITING') {
      await this.deleteOneTimeTokenRecord(tokenContext.adminId);
      throw new UnprocessableEntityException({
        message: 'Account is not waiting for verification',
        reason: 'VERIFICATION_IS_NOT_CAPABLE',
      });
    }
  }

  private async deleteOneTimeTokenRecord(adminId: number): Promise<void> {
    await this.prismaService.authOneTimeToken.delete({
      where: { adminId },
    });
  }

  private async fetchTokenContext(
    token: string,
    type: AuthTokenType,
    additionalAdminFields?: readonly (keyof AuthAdmin)[],
  ): Promise<OneTimeTokenContext> {
    const hashedToken: string = this.hashToken(token);
    const adminFields: (keyof AuthAdmin)[] = [];
    let adminColumns: Partial<Record<keyof AuthAdmin, true>> = {};

    if (additionalAdminFields) adminFields.push(...additionalAdminFields);

    switch (type) {
      case 'REGISTER':
        if (
          !additionalAdminFields ||
          !additionalAdminFields.includes('verification')
        )
          adminFields.push('verification');
        break;
    }

    const areAdminColumnsSelected: boolean = adminFields.length > 0;
    if (areAdminColumnsSelected) {
      adminColumns = adminFields.reduce(
        (acc, key) => {
          acc[key] = true;
          return acc;
        },
        {} as Partial<Record<keyof AuthAdmin, true>>,
      );
    }
    const tokenContext = await this.prismaService.authOneTimeToken.findUnique({
      where: { hashedToken, type },
      select: {
        hashedToken: true,
        expiresAt: true,
        adminId: true,
        admin: areAdminColumnsSelected
          ? { select: { ...adminColumns } }
          : false,
      },
    });

    if (!tokenContext)
      throw new BadRequestException(
        'The provided activation token is invalid or does not exist',
      );

    return tokenContext;
  }

  private hashToken(token: string): string {
    return this.hashService.hash(token);
  }
}
