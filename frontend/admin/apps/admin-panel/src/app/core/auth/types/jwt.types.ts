import { AdminVerification } from './admin-data.types';

export type AccessTokenPayload = {
  id: number;
  privileges: number;
  verification: AdminVerification;
  isActivated: boolean;
  exp: number;
};
