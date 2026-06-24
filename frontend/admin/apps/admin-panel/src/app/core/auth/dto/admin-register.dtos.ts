import { Admin, AdminPassword } from '../types/admin-data.types';

type Password = { password: AdminPassword };

export type RegistrationEligibilityRequestDto = string;
export type RegistrationEligibilityResponseDto = (keyof (Pick<Admin, 'handleName'> & Password))[];

export type FinalizeAdminRegistrationRequestDto = {
  oneTimeToken: string;
} & Partial<Pick<Admin, 'handleName'>> &
  Password;
