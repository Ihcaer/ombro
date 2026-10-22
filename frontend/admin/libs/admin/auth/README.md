# admin-auth

This library handles **authentication**, **session management**, **JWT tokens**.

## Features

| **Feature**            | **Description**                                                             |
| :--------------------- | :-------------------------------------------------------------------------- |
| **Login/Logout**       | Handles administrator login and logout processes                            |
| **Token refresh**      | Automatically refreshes access tokens before expiration                     |
| **Password reset**     | Supports password reset requests and completion                             |
| **Admin registration** | Verifies registration eligibility and finalizes admin accounts              |
| **Route protection**   | Guards that protect routes requiring authentication                         |
| **HTTP Interceptors**  | Adds authorization headers, handles 401 errors with automatic token refresh |

## Architecture

### Store

#### State:

```ts
AuthState = {
  accessToken: { token: string | null; expiresAtMs: number | null };
  isLoading: boolean;
  lastResponseError: HttpErrorResponse | null;
  lastInternalError: AuthStateInternalError | null;
}
```

#### Public methods:

- `login(credentials: LoginRequestDto)` - Authenticates administrator
- `logout()` - Logs out administrator
- `refreshTokens()` - Refreshes access token
- `requestPasswordReset(data: ForgotPasswordRequestDto)` - Requests password reset
- `resetPassword(data: ResetPasswordRequestDto)` - Completes password reset
- `checkRegistrationEligibility(token: string)` - Checks registration eligibility
- `finalizeAdminRegistration(data: ConfirmAdminRequestDto)` - Finalizes admin registration
- `clearInternalError()` - Clears internal errors

#### Computed properties:

- `isAccessTokenExpired` - Whether the access token has expired
- `isAdminLoggedIn` - Whether an administrator is logged in

#### Hooks:

- Automatic token refresh 30 seconds before expiration
- Error clearing on navigation

---

### HTTP interceptors

| **Interceptor**         | **Purpose**                                                                                  |
| :---------------------- | :------------------------------------------------------------------------------------------- |
| `apiPrefixInterceptor`  | Adds API prefix (domain + baseUrl) to all requests                                           |
| `authInterceptor`       | Adds `Authorization: Bearer <token>` header, handles 401 errors with automatic token refresh |
| `adminTokenInterceptor` | Adds `withCredentials: true` and authorization token                                         |

#### Token refresh mechanism:

1. On 401 error (regardless of endpoint), `refreshTokens()` is triggered
1. New token is used to retry the original request
1. On refresh failure, redirects to login page
1. `BehaviorSubject` prevents multiple refresh calls for concurrent requests

---

### Guards

| **Guard**         | **Purpose**                                                                       |
| :---------------- | :-------------------------------------------------------------------------------- |
| `authGuard`       | Checks if user is logged in and token is valid. Redirects to `/auth/login` if not |
| `privilegesGuard` | Checks if user has required privileges (from `route.data.privilegesRequired`)     |

## Dependencies

- `@ngrx/signals` - SignalStore, rxMethod
- `@ngrx/operators` - tapResponse
- `jwt-decode` - JWT token decoding
- `@ombro/shared/data-access/api-client` - API client (services: AuthService, AuthPasswordResetService, AuthRegistrationService)
- `@ombro/admin-user` - User library (UserStore)
- `@ombro/admin-panel` - Routing paths and configuration

## Usage examples

1. **Administrator login**

```ts
import { AuthStore } from '@ombro/admin-auth';

@Component({...})
export class LoginComponent {
  private authStore = inject(AuthStore);

  login() {
    this.authStore.login({
      email: 'admin@example.com',
      password: 'securePassword123!'
    });
  }
}
```

2. **Logout**

```ts
import { AuthStore } from '@ombro/admin-auth';

@Component({...})
export class HeaderComponent {
  private authStore = inject(AuthStore);

  logout() {
    this.authStore.logout();
  }
}
```

3. **Check if administrator is logged in**

```ts
import { AuthStore } from '@ombro/admin-auth';

@Component({...})
export class DashboardComponent {
  private authStore = inject(AuthStore);

  isLoggedIn = this.authStore.isAdminLoggedIn;
}
```

4. **Using guards in routing**

```ts
import { authGuard, privilegesGuard } from '@ombro/admin-auth';
import { AdminDtoPrivilegesItem } from '@ombro/shared/data-access/api-client';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardComponent,
  },
  {
    path: 'admin/users',
    canActivate: [authGuard, privilegesGuard],
    data: {
      privilegesRequired: new Set<AdminDtoPrivilegesItem>([AdminDtoPrivilegesItem.USERS_READ]),
    },
    component: UsersComponent,
  },
];
```

5. **HTTP interceptors configuration**

Interceptors are automatically registered via Angular DI. Import them in `app.config.ts`:

```ts
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([...authInterceptors()]))],
};
```
