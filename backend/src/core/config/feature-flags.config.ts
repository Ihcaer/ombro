import { AuthModule } from '@core/auth/auth.module';
import { PrismaModule } from '@core/database/prisma/prisma.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { UrlManagerModule } from '@modules/url-manager/url-manager.module';
import { Type } from '@nestjs/common';

const enabledModules: Type<any>[] = [
  PrismaModule,
  AuthModule,
  UrlManagerModule,
  NotificationsModule,
];

export default enabledModules;
