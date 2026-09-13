import { AdminDto } from '../models/admin.dto';

export class LoginResponseDto {
  readonly accessToken!: string;
  readonly adminData!: AdminDto;
}
