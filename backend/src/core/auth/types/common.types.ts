import { AuthAdmin } from '@generated/prisma-client';
import { LoginResponseDto } from '../dto';

export type SignInResponse = {
  readonly adminData: LoginResponseDto;
  readonly refreshTokenData: { token: string; maxAge: number };
};

export type PossibleFieldsToFill = Pick<AuthAdmin, 'password'> &
  Partial<Pick<AuthAdmin, 'handleName'>>;
