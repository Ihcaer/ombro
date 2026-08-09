import { AdminDataDto } from './admin-data.dto';

export class LoginResponseDto {
  readonly accessToken!: string;

  readonly adminData!: AdminDataDto;
}
