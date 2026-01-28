import { AdminData } from '../types/common.types';

export type LoginResponseDto = {
  readonly jwt: string;
  readonly adminData: AdminData;
};
