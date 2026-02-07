import { AuthAdmin } from '@generated/prisma-client';
import { LoginResponseDto } from '../dto/login-response.dto';

export type Identifier = keyof Pick<AuthAdmin, 'email' | 'handleName'>;

export type AdminData = Pick<
  AuthAdmin,
  'id' | 'displayName' | 'handleName' | 'avatarId' | 'privileges' | 'verification' | 'isActivated'
>;

export type SignInResponse = {
  readonly adminData: LoginResponseDto;
  readonly refreshTokenData: { token: string; maxAge: number };
};

export type PossibleFieldsToFill = Pick<AuthAdmin, 'password'> &
  Partial<Pick<AuthAdmin, 'handleName'>>;
