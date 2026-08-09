import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { IsValidPrivilege } from '../decorators/is-valid-privilege.decorator';
import { Trim } from '@shared/decorators';
import { AuthAdmin } from '@generated/prisma-client';
import { Transform } from 'class-transformer';
import { PrivilegesUtils } from '../utils/privileges.utils';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { enumKeysWithout } from '@shared/swagger/enum-keys-without.helper';
import { AdminDataDto } from './admin-data.dto';
import { AdminPrivileges } from '../enums/admin-privileges';

export class CreateAdminRequestDto
  implements
    Pick<AuthAdmin, 'displayName' | 'email' | 'privileges'>,
    Partial<Pick<AuthAdmin, 'handleName'>>
{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly displayName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  readonly handleName?: string;

  @ApiProperty({ format: 'email' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Trim()
  readonly email!: string;

  @ApiProperty({
    readOnly: true,
    enum: enumKeysWithout(AdminPrivileges, AdminDataDto.EXCLUDED_PRIVILEGES),
    isArray: true,
    example: AdminDataDto.SAMPLE_ADMIN_PRIVILEGES,
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
