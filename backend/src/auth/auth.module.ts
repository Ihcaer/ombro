import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CommonModule } from '@common/common.module';
import { ConfigModule } from '@nestjs/config';
import serverConfig from '@config/server.config';
import { PrismaModule } from '@app-prisma/prisma.module';
import { HashModule } from '@common/hash/hash.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forFeature(serverConfig),
    PrismaModule,
    HashModule,
    JwtModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
