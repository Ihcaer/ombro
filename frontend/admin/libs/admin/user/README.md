# admin-user

This library handles **logged-in administrator data** and **privilege verification**.

## Features

| **Feature**                | **Description**                                |
| :------------------------- | :--------------------------------------------- |
| **User data storage**      | State containing administrator data            |
| **Privilege verification** | Methods to check user privileges               |
| **Data access**            | Computed properties for convenient data access |

## Architecture

### Models

[Model file](./src/lib/models/admin-user.model.ts)

### Store

#### State:

```ts
UserState = {
  user: AdminUser | null;
}
```

#### Methods:

- `setUser(user: AdminUser)` - Sets user data
- `clearUser()` - Clears user data
- `hasUser()` - Checks if user is set
- `hasPrivilege(privilege: AdminDtoPrivilegesItem)` - Checks if user has a specific privilege
- `hasAppropriatePrivileges(neededPrivileges: Set<AdminDtoPrivilegesItem>)` - Checks if user has all required privileges

## Dependencies

- `@ngrx/signals` - SignalStore
- `@ombro/shared/data-access/api-client` - API types (AdminDto, AdminDtoPrivilegesItem)

## Usage examples

1. **Check user privileges**

```ts
import { AdminUserStore } from '@ombro/admin-user';
import { AdminDtoPrivilegesItem } from '@ombro/shared/data-access/api-client';

@Component({...})
export class UsersComponent {
  private adminUserStore = inject(AdminUserStore);

  canEditUsers = this.adminUserStore.hasPrivilege(AdminDtoPrivilegesItem.USERS_WRITE);
  canDeleteUsers = this.adminUserStore.hasPrivilege(AdminDtoPrivilegesItem.USERS_DELETE);

  // Check multiple privileges
  canManageUsers = this.adminUserStore.hasAppropriatePrivileges(
    new Set([
      AdminDtoPrivilegesItem.USERS_READ,
      AdminDtoPrivilegesItem.USERS_WRITE
    ])
  );
}
```

## Integration with admin-auth

The `admin-auth` library uses `admin-user`:

- After successful login: `adminUserStore.setUser(adminUser)`
- On logout: `adminUserStore.clearUser()`
- privilegesGuard uses `AdminUserStore.hasAppropriatePrivileges()`

## Library relationship

```text
@ombro/admin-auth
    │
    ├── Uses AdminUserStore from @ombro/admin-user
    ├── privilegesGuard uses AdminUserStore methods
    └── Both libraries are UI-agnostic (business logic only)

@ombro/admin-user
    └── Standalone user data management
```
