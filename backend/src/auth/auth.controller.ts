import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequestDto } from './dto/loginRequest.dto';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() loginRequestDto: LoginRequestDto): Promise<void> {}
}
