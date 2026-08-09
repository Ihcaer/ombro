import { Trim } from '@shared/decorators';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsOneTimeToken } from '../decorators';
import { PossibleFieldsToFill } from '../types/common.types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConfirmAdminRequestDto implements PossibleFieldsToFill {
  @ApiProperty({ description: 'One time token' })
  @IsString()
  @IsNotEmpty()
  @IsOneTimeToken()
  readonly oneTimeToken!: Base64URLString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  readonly handleName?: string;

  // password strength is checked in the service
  @ApiProperty({ format: 'password' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256, { message: 'Password is too long. Maximum length is 128 characters.' })
  readonly password!: string;
}
