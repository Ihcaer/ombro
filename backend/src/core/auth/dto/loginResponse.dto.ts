import { AdminData } from '../types/common.types';

export class LoginResponseDto {
  readonly jwt: string;
  readonly adminData: AdminData;
}
