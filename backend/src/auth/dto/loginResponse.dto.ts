import { AuthVerification } from '@generated/prisma-client';

export class LoginResponseDto {
  readonly jwt: string;
  readonly adminData: {
    readonly id: number;
    readonly displayName: string;
    readonly handleName: string;
    readonly avatarId: number;
    readonly privileges: number;
    readonly verification: AuthVerification;
    readonly isActivated: boolean;
  };
}
