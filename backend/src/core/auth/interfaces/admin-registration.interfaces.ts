import { AdminPreferences } from '../dto/models/adminPreferences.dto.js';
import { PossibleFieldsToFill } from '../types/common.types.js';

export interface AdminConfirmationData extends PossibleFieldsToFill {
  id: number;
  refreshTokenId: number;
  preferences: Pick<AdminPreferences, 'language'>;
}
