import { EmailModule } from '@app/email/email.module';
import { AuthModule } from '@auth/auth.module';
import { CommonModule } from '@common/common.module';
import { Type } from '@nestjs/common';
import { PrismaModule } from '@app-prisma/prisma.module';
import { UrlManagerModule } from '@url-manager/url-manager.module';

const enabledModules: Type<any>[] = [
  PrismaModule,
  CommonModule,
  UrlManagerModule,
  EmailModule,
  AuthModule,
];

export default enabledModules;
