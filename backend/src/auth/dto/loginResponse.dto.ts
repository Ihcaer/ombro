import { AdminData } from '@auth/types/common.types';

export class LoginResponseDto {
  readonly jwt: string;
  readonly adminData: AdminData;
}
