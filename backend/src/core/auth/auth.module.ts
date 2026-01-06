import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AuthTokenService } from './services/auth-token.service';
import { AuthAdminRepository } from './auth-admin.repository';
import securityConfig from '@core/config/security.config';
import { PrismaModule } from '@core/database/prisma/prisma.module';
import { HashModule } from '@shared/hash/hash.module';

@Module({
  imports: [
    ConfigModule.forFeature(securityConfig),
    PrismaModule,
    HashModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    AuthTokenService,
    AuthAdminRepository,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
