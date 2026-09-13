import { IsOneTimeToken } from '@core/auth/decorators';
import { IsNotEmpty, IsString } from 'class-validator';

export class FieldsToConfirmAccountRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsOneTimeToken()
  readonly token!: Base64URLString;
}
