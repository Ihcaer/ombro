import { IsBase64, IsString } from 'class-validator';

export class FieldsToConfirmAccountRequestDto {
  @IsString()
  @IsBase64({ urlSafe: true })
  token: Base64URLString;
}
