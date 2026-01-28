import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AuthTokenService } from './services/auth-token/auth-token.service';
import { AuthAdminRepository } from './auth-admin.repository';
import { PrismaModule } from '@core/database/prisma/prisma.module';
import { HashModule } from '@shared/hash/hash.module';
import { AdminRegistrationService } from './services/admin-registration/admin-registration.service';
import securityConfig from '@core/config/envs/security.config';

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
    AdminRegistrationService,
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
