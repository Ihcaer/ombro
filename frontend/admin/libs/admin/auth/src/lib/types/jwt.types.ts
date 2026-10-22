import { AdminDtoVerification } from '@ombro/shared/data-access/api-client';

export type AccessTokenPayload = {
  id: number;
  privileges: number;
  verification: AdminDtoVerification;
  isActivated: boolean;
  exp: number;
};
