import { IsNotEmpty, IsString } from 'class-validator';
import { IsOneTimeToken } from '../decorators';
import { ApiProperty } from '@nestjs/swagger';

export class FieldsToConfirmAccountRequestDto {
  @ApiProperty({ description: 'One time token' })
  @IsString()
  @IsNotEmpty()
  @IsOneTimeToken()
  readonly token!: Base64URLString;
}
