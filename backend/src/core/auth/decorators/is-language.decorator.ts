import { applyDecorators } from '@nestjs/common';
import { Language } from '../auth.constants';
import { DefaultEnum } from '@shared/decorators/default-enum.decorator';
import { IsEnum } from 'class-validator';

export const IsLanguage = (defaultLanguage: Language = Language.EN) =>
  applyDecorators(DefaultEnum(Language, defaultLanguage), IsEnum(Language));
