import { Module, Provider } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service.js';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy.js';
import { AuthTokenService } from './services/auth-token/auth-token.service.js';
import { AuthAdminRepository } from './auth-admin.repository.js';
import { PrismaModule } from '@core/database/prisma/prisma.module.js';
import { HashModule } from '@shared/hash/hash.module.js';
import { AdminRegistrationService } from './services/admin-registration/admin-registration.service.js';
import { PasswordResetService } from './services/password-reset/password-reset.service.js';
import { RegistrationPublicController } from './controllers/registration/registration-public.controller.js';
import { PasswordResetController } from './controllers/password-reset/password-reset.controller.js';
import securityConfig from '@core/config/envs/security.config.js';
import { AuthPublicController } from './controllers/auth/auth-public.controller.js';
import serverConfig from '@core/config/envs/server.config.js';
import { PasswordStrengthProvider } from './providers/password-strength.provider.js';
import { AuthRefreshController } from './controllers/auth/auth-refresh.controller.js';
import { RegistrationAdminController } from './controllers/registration/registration-admin.controller.js';
import { BullModule } from '@nestjs/bullmq';
import { TOKEN_CLEANUP_QUEUE } from './auth.constants.js';
import { TokenCleanupScheduler } from './cron/token-cleanup.scheduler.js';
import { TokenCleanupConsumer } from './cron/token-cleanup.consumer.js';

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
