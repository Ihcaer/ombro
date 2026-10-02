import { CreateLogDto } from '@modules/audit/dto/create-log.dto.js';

export const authModuleDataSerializer = (logData: CreateLogDto): CreateLogDto => ({
  ...logData,
  module: 'admin',
  entityType: 'admin',
});
