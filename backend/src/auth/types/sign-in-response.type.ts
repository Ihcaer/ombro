import { LoginResponseDto } from '@auth/dto/loginResponse.dto';

export type SignInResponse = {
  readonly adminData: LoginResponseDto;
  readonly refreshTokenData: { token: string; maxAge: number };
};
