import { Expose, Transform } from 'class-transformer';
import { FeatureModule } from '../../../feature-module.enum.js';
import { IsEnum } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { validateConfig } from '../env-config.validator.js';

export class ModulesConfig {
  @Expose({ name: 'ENABLED_MODULES' })
  @Transform(({ value }) => {
    if (typeof value !== 'string') return new Set<FeatureModule>();

    return new Set(
      value
        .split(',')
        .map((module) => module.trim().toLowerCase())
        .filter(Boolean),
    );
  })
  @IsEnum(FeatureModule, { each: true })
  enabledModules!: Set<FeatureModule>;
}

export default registerAs('modules', () => validateConfig(ModulesConfig));
