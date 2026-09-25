import { AdminDto } from '../models/admin.dto.js';

export class LoginResponseDto {
  readonly accessToken!: string;
  readonly adminData!: AdminDto;
}
