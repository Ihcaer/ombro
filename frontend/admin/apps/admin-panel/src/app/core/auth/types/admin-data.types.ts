export type AdminPrivilege =
  | 'ADMINS_MANAGE'
  | 'FILE_MANAGE'
  | 'BLOG_MANAGE'
  | 'SUPER_ADMIN'
  | 'OWNER';

export type AdminPrivileges = Set<AdminPrivilege>;

export type AdminVerification = 'VERIFIED' | 'WAITING' | 'NON_VERIFIED';

export type Admin = {
  id: number;
  displayName: string;
  handleName: string;
  avatarUrl: string | null;
  privileges: AdminPrivileges;
  verification: AdminVerification;
  isActivated: boolean;
  email?: string;
};

export type AdminPassword = string;
