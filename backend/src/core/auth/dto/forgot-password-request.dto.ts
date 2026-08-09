import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '@shared/decorators';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class ForgotPasswordRequestDto {
  @ApiProperty({ format: 'email' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Trim()
  email!: string;
}
