import { Trim } from '@shared/decorators';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class ForgotPasswordRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Trim()
  email!: string;
}
