import { AuthAdmin } from '@generated/prisma-client/client.js';
import { LoginResponseDto } from '../dto/index.js';

export type SignInResponse = {
  readonly adminData: LoginResponseDto;
  readonly refreshTokenData: { token: string; maxAge: number };
};

export type PossibleFieldsToFill = Pick<AuthAdmin, 'password'> &
  Partial<Pick<AuthAdmin, 'handleName'>>;
