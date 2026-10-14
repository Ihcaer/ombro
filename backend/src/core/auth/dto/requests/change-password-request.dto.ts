import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly currentPassword!: string;

  @IsString()
  @IsNotEmpty()
  readonly newPassword!: string;
}
