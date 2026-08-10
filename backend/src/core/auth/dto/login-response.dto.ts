import { AdminDto } from './admin.dto';

export class LoginResponseDto {
  readonly accessToken!: string;

  readonly adminData!: AdminDto;
}
