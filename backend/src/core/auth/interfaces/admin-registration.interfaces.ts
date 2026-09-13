import { AdminPreferences } from '../dto/models/adminPreferences.dto';
import { PossibleFieldsToFill } from '../types/common.types';

export interface AdminConfirmationData extends PossibleFieldsToFill {
  id: number;
  refreshTokenId: number;
  preferences: Pick<AdminPreferences, 'language'>;
}
