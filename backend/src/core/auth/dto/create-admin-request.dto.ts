import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsValidPrivilege } from '../decorators/is-valid-privilege.decorator';

export class CreateAdminRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly displayName: string;

  @IsOptional()
  @IsString()
  readonly handleName?: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @IsNumber()
  @IsValidPrivilege({
    message: 'The value of these privileges does not exist.',
  })
  readonly privileges: number;
}
