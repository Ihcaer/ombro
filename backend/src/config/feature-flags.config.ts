import { EmailModule } from '@app/email/email.module';
import { CommonModule } from '@common/common.module';
import { Type } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { UrlManagerModule } from '@url-manager/url-manager.module';

const enabledModules: Type<any>[] = [
  PrismaModule,
  CommonModule,
  UrlManagerModule,
  EmailModule,
];

export default enabledModules;
