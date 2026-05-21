import { Admin } from '../types/admin-data.types';

export type RegistrationEligibilityRequestDto = string;
export type RegistrationEligibilityResponseDto = (keyof Pick<Admin, 'password' | 'handleName'>)[];

export type FinalizeAdminRegistrationRequestDto = { oneTimeToken: string } & Pick<
  Admin,
  'password'
> &
  Partial<Pick<Admin, 'handleName'>>;
