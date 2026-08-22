import { AuthAdmin } from '@generated/prisma-client';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsOneTimeToken } from '@core/auth/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequestDto implements Pick<AuthAdmin, 'password'> {
  @IsString()
  @IsNotEmpty()
  @IsOneTimeToken()
  readonly token!: Base64URLString;

  // password strength is checked in the service
  @ApiProperty({ format: 'password' })
  @IsString()
  @IsNotEmpty()
  readonly password!: string;
}
