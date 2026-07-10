import { Trim } from '@shared/decorators';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsOneTimeToken } from '../decorators';
import { PossibleFieldsToFill } from '../types/common.types';

export class ConfirmAdminRequestDto implements PossibleFieldsToFill {
  @IsString()
  @IsNotEmpty()
  @IsOneTimeToken()
  readonly oneTimeToken!: Base64URLString;

  @IsOptional()
  @IsString()
  @Trim()
  readonly handleName?: string;

  // password strength is checked in the service
  @IsString()
  @IsNotEmpty()
  @MaxLength(256, { message: 'Password is too long. Maximum length is 128 characters.' })
  readonly password!: string;
}
