import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty({ message: 'Identifier (email or handle) is required.' })
  @IsString({ message: 'Identifier (email or handle) should be a string.' })
  readonly identifier: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @IsString({ message: 'Password should be a string.' })
  readonly password: string;
}
