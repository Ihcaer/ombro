import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { IsValidPrivilege } from '../decorators/is-valid-privilege.decorator';
import { Trim } from '@shared/decorators';
import { AuthAdmin } from '@generated/prisma-client';
import { Transform } from 'class-transformer';
import { PrivilegesUtils } from '../utils/privileges.utils';

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
