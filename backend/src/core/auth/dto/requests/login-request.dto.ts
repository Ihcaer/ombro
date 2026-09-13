import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '@shared/decorators';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ description: 'Email or handle' })
  @IsNotEmpty({ message: 'Identifier (email or handle) is required.' })
  @IsString({ message: 'Identifier (email or handle) should be a string.' })
  @Trim()
  readonly identifier!: string;

  @ApiProperty({ format: 'password' })
  @IsNotEmpty({ message: 'Password is required.' })
  @IsString({ message: 'Password should be a string.' })
  readonly password!: string;
}
