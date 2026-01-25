import { AdminPrivileges } from '../enums/admin-privileges';

export class PrivilegesUtils {
  static hasAll(
    adminPrivileges: number,
    requiredPrivileges: AdminPrivileges[],
  ): boolean {
    if (requiredPrivileges.length === 0) return true;
    const mask = requiredPrivileges.reduce((acc, curr) => acc | curr, 0);
    return (adminPrivileges & mask) === mask;
  }

  static isValid(permissions: number): boolean {
    const allPrivileges = Object.values(AdminPrivileges).filter(
      (v): v is AdminPrivileges => typeof v === 'number',
    );
    const allPossibleMask = allPrivileges.reduce(
      (acc: number, curr: AdminPrivileges) => acc | curr,
      0,
    );

    return (permissions & allPossibleMask) === permissions;
  }
}
