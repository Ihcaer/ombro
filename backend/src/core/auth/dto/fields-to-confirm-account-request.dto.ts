import { IsNotEmpty, IsString } from 'class-validator';
import { IsOneTimeToken } from '../decorators';

export class FieldsToConfirmAccountRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsOneTimeToken()
  readonly token: Base64URLString;
}
