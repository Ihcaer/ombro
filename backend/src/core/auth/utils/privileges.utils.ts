import { AuthAdmin } from '@generated/prisma-client';
import { AdminPrivileges } from '../enums/admin-privileges';
import { AdminPrivilegesTranslated } from '../types/admin.types';

export class PrivilegesUtils {
  static hasAll(adminPrivileges: number, requiredPrivileges: AdminPrivileges[]): boolean {
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

  static arrayToBitmask(permissions: AdminPrivilegesTranslated[]): AuthAdmin['privileges'] | null {
    if (!Array.isArray(permissions)) return null;

    let bitmask = 0;

    for (const permission of permissions) {
      const bitValue = AdminPrivileges[permission];
      if (bitValue === undefined) return null;
      bitmask |= bitValue;
    }

    return bitmask;
  }

  static convertToEnumTable(privileges: AdminPrivilegesTranslated[]): AdminPrivileges[] {
    return privileges.map((privilege) => AdminPrivileges[privilege]);
  }

  static bitmaskToArray(bitmask: AuthAdmin['privileges']): AdminPrivilegesTranslated[] {
    const permissionKeys = Object.keys(AdminPrivileges).filter(
      (key) => typeof AdminPrivileges[key] === 'number',
    ) as AdminPrivilegesTranslated[];

    return permissionKeys.filter((key) => {
      const bitValue = AdminPrivileges[key];
      return (bitmask & bitValue) !== 0;
    });
  }
}
