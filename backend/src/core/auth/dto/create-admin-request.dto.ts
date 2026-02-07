import { IsDefined, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsValidPrivilege } from '../decorators/is-valid-privilege.decorator';
import { Trim } from '@shared/decorators';
import { AuthAdmin } from '@generated/prisma-client';

export class CreateAdminRequestDto
  implements
    Pick<AuthAdmin, 'displayName' | 'email' | 'privileges'>,
    Partial<Pick<AuthAdmin, 'handleName'>>
{
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly displayName: string;

  @IsOptional()
  @IsString()
  @Trim()
  readonly handleName?: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Trim()
  readonly email: string;

  @IsDefined()
  @IsNumber()
  @IsValidPrivilege()
  readonly privileges: number;
}
