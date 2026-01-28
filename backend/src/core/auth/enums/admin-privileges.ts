export enum AdminPrivileges {
  NONE = 0,
  ADMINS_MANAGE = 1 << 0,
  FILE_MANAGE = 1 << 1,
  BLOG_MANAGE = 1 << 2,
  SUPER_ADMIN = 1 << 29,
  OWNER = 1 << 30,
}
