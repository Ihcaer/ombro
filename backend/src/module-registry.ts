import { Type } from '@nestjs/common';
import { FeatureModule } from './feature-module.enum.js';
import modulesConfig, { ModulesConfig } from '@core/config/envs/modules.config.js';
import { AuthModule } from '@core/auth/auth.module.js';
import { PrismaModule } from '@core/database/prisma/prisma.module.js';
import { NotificationsModule } from '@modules/notifications/notifications.module.js';
import { UrlManagerModule } from '@modules/url-manager/url-manager.module.js';

const coreModules: Type<unknown>[] = [
  PrismaModule,
  AuthModule,
  UrlManagerModule,
  NotificationsModule,
] as const;

const featureModules: ReadonlyArray<{ feature: FeatureModule; module: Type<unknown> }> =
  [] as const;

export const getApplicationModules = (): Type<unknown>[] => {
  const config: ModulesConfig = modulesConfig();

  return [
    ...coreModules,
    ...featureModules
      .filter(({ feature }) => config.enabledModules.has(feature))
      .map(({ module }) => module),
  ];
};
