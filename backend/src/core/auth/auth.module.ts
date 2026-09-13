import { Module, Provider } from '@nestjs/common';
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
import { RegistrationPublicController } from './controllers/registration/registration-public.controller';
import { PasswordResetController } from './controllers/password-reset/password-reset.controller';
import securityConfig from '@core/config/envs/security.config';
import { AuthPublicController } from './controllers/auth/auth-public.controller';
import serverConfig from '@core/config/envs/server.config';
import { PasswordStrengthProvider } from './providers/password-strength.provider';
import { AuthRefreshController } from './controllers/auth/auth-refresh.controller';
import { RegistrationAdminController } from './controllers/registration/registration-admin.controller';
import { BullModule } from '@nestjs/bullmq';
import { TOKEN_CLEANUP_QUEUE } from './auth.constants';
import { TokenCleanupScheduler } from './cron/token-cleanup.scheduler';
import { TokenCleanupConsumer } from './cron/token-cleanup.consumer';

const SERVICES: Provider[] = [
  AuthService,
  AuthTokenService,
  AdminRegistrationService,
  PasswordResetService,
] as const;
const STRATEGIES: Provider[] = [JwtStrategy, RefreshTokenStrategy] as const;
const MISC_PROVIDERS: Provider[] = [
  AuthAdminRepository,
  PasswordStrengthProvider,
  TokenCleanupScheduler,
  TokenCleanupConsumer,
] as const;

@Module({
  imports: [
    ConfigModule.forFeature(securityConfig),
    ConfigModule.forFeature(serverConfig),
    PrismaModule,
    HashModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    BullModule.registerQueue({ name: TOKEN_CLEANUP_QUEUE }),
  ],
  providers: [...SERVICES, ...STRATEGIES, ...MISC_PROVIDERS],
  controllers: [
    AuthPublicController,
    AuthRefreshController,
    RegistrationPublicController,
    RegistrationAdminController,
    PasswordResetController,
  ],
  exports: [],
})
export class AuthModule {}
