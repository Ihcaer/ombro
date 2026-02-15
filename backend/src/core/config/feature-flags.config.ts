import { AuthModule } from '@core/auth/auth.module';
import { PrismaModule } from '@core/database/prisma/prisma.module';
import { UrlManagerModule } from '@modules/url-manager/url-manager.module';
import { Type } from '@nestjs/common';
import { EmailModule } from '@shared/email/email.module';

const enabledModules: Type<any>[] = [PrismaModule, UrlManagerModule, EmailModule, AuthModule];

export default enabledModules;
