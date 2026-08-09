import { ApiProperty } from '@nestjs/swagger';
import { AdminDataDto } from './admin-data.dto';

export class LoginResponseDto {
  @ApiProperty({
    readOnly: true,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
  })
  readonly accessToken!: string;

  @ApiProperty({ readOnly: true })
  readonly adminData!: AdminDataDto;
}
