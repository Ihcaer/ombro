import { AuthAdmin } from '@generated/prisma-client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConfirmAdminRequestDto implements Partial<AuthAdmin> {
  @IsOptional()
  @IsString()
  handleName?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
