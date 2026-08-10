import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { IsValidPrivilege } from '../decorators/is-valid-privilege.decorator';
import { Trim } from '@shared/decorators';
import { AuthAdmin } from '@generated/prisma-client';
import { Transform } from 'class-transformer';
import { PrivilegesUtils } from '../utils/privileges.utils';
import { ApiProperty } from '@nestjs/swagger';
import { enumKeysWithout } from '@shared/swagger/enum-keys-without.helper';
import { AdminDto } from './admin.dto';
import { AdminPrivileges } from '../enums/admin-privileges';

export class CreateAdminRequestDto
  implements
    Pick<AuthAdmin, 'displayName' | 'email' | 'privileges'>,
    Partial<Pick<AuthAdmin, 'handleName'>>
{
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly displayName!: string;

  @IsOptional()
  @IsString()
  @Trim()
  readonly handleName?: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Trim()
  readonly email!: string;

  @ApiProperty({
    enum: enumKeysWithout(AdminPrivileges, AdminDto.EXCLUDED_PRIVILEGES),
    isArray: true,
    example: AdminDto.SAMPLE_ADMIN_PRIVILEGES,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @Transform(({ value }) => PrivilegesUtils.arrayToBitmask(value), { toClassOnly: true })
  @IsInt({
    message:
      'One or more of the specified permissions are invalid or the array is in the wrong format.',
  })
  @Min(0)
  @IsValidPrivilege()
  readonly privileges!: number;
}
