import { AuthVerification } from '@generated/prisma-client';

export class AdminDto {
  readonly id: number;
  readonly displayName: string;
  readonly handleName: string;
  readonly password: string;
  readonly avatarId: number;
  readonly privileges: number;
  readonly verification: AuthVerification;
  readonly isActivated: boolean;
}
