import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { CommonModule } from '@common/common.module';
import { ConfigModule } from '@nestjs/config';
import serverConfig from '@config/server.config';
import { PrismaModule } from '@app-prisma/prisma.module';
import { HashModule } from '@common/hash/hash.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AuthTokenService } from './services/auth-token.service';
import { AuthAdminRepository } from './auth-admin.repository';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forFeature(serverConfig),
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
