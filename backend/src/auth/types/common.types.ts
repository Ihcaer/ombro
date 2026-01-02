import { LoginResponseDto } from '@auth/dto/loginResponse.dto';
import { AuthVerification } from '@generated/prisma-client';

export type Identifier = 'email' | 'handleName';

export type AdminData = {
  readonly id: number;
  readonly displayName: string;
  readonly handleName: string | null;
  readonly avatarId: number | null;
  readonly privileges: number;
  readonly verification: AuthVerification;
  readonly isActivated: boolean;
};

export type SignInResponse = {
  readonly adminData: LoginResponseDto;
  readonly refreshTokenData: { token: string; maxAge: number };
};
