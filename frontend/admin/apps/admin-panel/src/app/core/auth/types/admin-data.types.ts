export type AdminVerification = 'VERIFIED' | 'WAITING' | 'NON_VERIFIED';

export type Admin = {
  id: number;
  displayName: string;
  handleName: string;
  avatarId: number | null;
  privileges: number;
  verification: AdminVerification;
  isActivated: boolean;
};
