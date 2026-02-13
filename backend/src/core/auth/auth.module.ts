import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
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
import { PasswordResetService } from './services/password-reset/password-reset.service';
import { RegistrationController } from './controllers/registration/registration.controller';
import { PasswordResetController } from './controllers/password-reset/password-reset.controller';
import securityConfig from '@core/config/envs/security.config';
import { AuthController } from './controllers/auth/auth.controller';

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
    PasswordResetService,
  ],
  controllers: [AuthController, RegistrationController, PasswordResetController],
  exports: [],
})
export class AuthModule {}
