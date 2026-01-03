import { AuthVerification } from '@generated/prisma-client';

export class AdminDto {
  readonly id: number;
  readonly displayName: string;
  readonly handleName: string | null;
  readonly password: string | null;
  readonly avatarId: number | null;
  readonly privileges: number;
  readonly verification: AuthVerification;
  readonly isActivated: boolean;
}
